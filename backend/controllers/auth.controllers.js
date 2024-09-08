import User from "../models/user.model.js";
import Counter from "../models/counter.model.js";
import jwt from "jsonwebtoken";
import redis from "../lib/redis.js";

// Get userId sequence and update it by 1.
async function getNextSequenceValue(sequenceName){
    const sequenceDocument = await Counter.findOneAndUpdate(
        {_id: sequenceName},
        {$inc:{seq : 1}},
        {new: true, upsert:true}
    );
    return sequenceDocument.seq;
}

// Rollback userId sequence by 1 while error.
async function rollBackSequenceValue(sequenceName){
    const sequenceDocument = await Counter.findOneAndUpdate(
        {_id: sequenceName},
        {$inc:{seq : -1}},
        {new: false, upsert:false}
    );
    return sequenceDocument.seq;
}

// Generate a token based on user._id.
const generateToken = (uniqueId) => {
    const accessToken = jwt.sign({uniqueId}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m'
    });

    const refreshToken = jwt.sign({uniqueId}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });

    return {accessToken, refreshToken};
}

// Store refreshToken to redis.
const storeRefreshToken = async (uniqueId, refreshToken) => {
    await redis.set(`refresh_token:${uniqueId}`, refreshToken,"EX",7 * 24 * 60 * 60); // Expire in 7d.
}

// Set cookies.
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("access_token", accessToken, {
        httpOnly: false,
        secure: true /*process.env.NODE_ENV === "production"*/,
        sameSite: 'none',
        maxAge: 1000 * 60 * 15, // expire in 15min
        path:"/"
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: false,
        secure: true /*process.env.NODE_ENV === "production"*/,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // expire in 7days
        path:"/"
    })

    //TODO: Modify back to production mode before deploy.
}

export const signup = async (req, res) => {
    const { username, password, email, customerName } =  req.body;

    try{
        // Check if the user exist, if isn't, create one.
        const userExist = await User.findOne({username} );

        if (userExist) {
            return res.status(400).json({message: 'User already exist'});
        }

        // Get the next userId in the sequence.
        const userId = await getNextSequenceValue('userId');

        // Create the new user.
        const user = await User.create({username, password, email, customerName, userId})

        // authenticate ( create token, store token, set cookie)
        const { accessToken , refreshToken } = await generateToken(user._id);
        await storeRefreshToken(user._id,refreshToken);

        setCookies(res, accessToken, refreshToken);

        return res.status(201).json({ user, message: 'User created successfully.'});
    }catch(err) {
        await rollBackSequenceValue('userId');
        if(err.message.includes('email')){
            res.status(401).json({message: 'Email already exist'});
        }else{
            res.status(500).json({message: 'Server error', error: err.message});
        }
    }
}

export const signin = async (req, res) => {
    try{
        const { username , password } =  req.body;
        const user = await User.findOne({username});
        if (user && (await user.comparePassword(password))) {
            const {accessToken , refreshToken} = await generateToken(user._id);
            await storeRefreshToken(user._id,refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({user, message: 'Sign in successfully.'});
        }else{
            res.status(401).json({message: 'Invalid username or password'});
        }
    }catch (err){
        res.status(500).json({message: err.message});
    }
}

export const signout = async (req, res) => {
    try{
        const refreshToken = req.cookies.refresh_token;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            await redis.del(`refresh_token:${decoded.uniqueId}`)

            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.json({message: 'User signed out successfully.'});
        }
    }catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if(!refreshToken){
            return res.status(401).json({message: 'Refresh token not found.'});
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.uniqueId}`);

        if(refreshToken !== storedToken){
            return res.status(401).json({message: 'Invalid token.'});
        }

        const accessToken = jwt.sign({uniqueId : decoded.uniqueId}, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '15m'
        });

        res.cookie("access_token", accessToken, {
            httpOnly: true, //prevent XSS attack
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 1000 * 60 * 15, // expire in 15min
        });

        res.json({message: 'Refresh access token successfully.'});
    }catch (err){
        res.status(500).json({message: err.message});
    }
}

export const getProfile = async (req, res) => {
    try {
        // const { tokenFromUser } = req.body;
        console.log(req.body);
        res.status(200).json({message: "Token correct."})
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Something wrong."})
    }
}

//TODO
// getProfile function