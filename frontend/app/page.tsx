import {Box, Container, Grid} from "@radix-ui/themes";

export default function Home() {
  return (
      <Box style={{ background: 'var(--gray-a2)' }}>
          <Container size="4">
              <Grid columns={{ initial: '1', md: '2' }} gap="3" width="auto">
                  <Box height="64px" style={{ background: 'var(--gray-a4)' }}>
                      aaa
                  </Box>
                  <Box height="64px" style={{ background: 'var(--gray-a4)' }}>
                      aaa
                  </Box>
              </Grid>
          </Container>
      </Box>

  );
}
