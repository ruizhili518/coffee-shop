"use client";

import {Box, Button, Card, Flex, Heading, TextField , Text, Link} from "@radix-ui/themes";
import React from 'react';

type SignInBoxProps = React.ComponentPropsWithoutRef<typeof Flex> & {
    focusable?: boolean;
};

const SignInBox = ({ focusable = true, ...props }: SignInBoxProps) => {
    // Interactive elements may be not focusable for homepage demo purposes
    const tabIndex = focusable ? undefined : -1;

    return (
        <Flex flexShrink="0" gap="6" direction="column" maxWidth="600px">
            <Card size="5">
                <Heading as="h3" size="6" trim="start" mb="5">
                    Sign In
                </Heading>

                <Box mb="5">
                    <Flex mb="1">
                        <Text as="label" htmlFor="example-email-field" size="2" weight="bold">
                            Email address
                        </Text>
                    </Flex>
                    <TextField.Root
                        tabIndex={tabIndex}
                        placeholder="Enter your email"
                        id="example-email-field"
                    />
                </Box>

                <Box mb="5" position="relative">
                    <Flex align="baseline" justify="between" mb="1">
                        <Text as="label" size="2" weight="bold" htmlFor="example-password-field">
                            Password
                        </Text>
                        <Link href="#" tabIndex={tabIndex} size="2" onClick={(e) => e.preventDefault()}>
                            Forgot password?
                        </Link>
                    </Flex>
                    <TextField.Root
                        tabIndex={tabIndex}
                        placeholder="Enter your password"
                        id="example-password-field"
                    />
                </Box>

                <Flex mt="6" justify="end" gap="3">
                    <Button tabIndex={tabIndex} variant="outline">
                        Create an account
                    </Button>
                    <Button tabIndex={tabIndex}>Sign in</Button>
                </Flex>
            </Card>
        </Flex>
    );
};

export default SignInBox;

