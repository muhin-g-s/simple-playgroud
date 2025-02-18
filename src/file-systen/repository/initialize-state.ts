import { IInitializationStrategy } from './types';

export const defaultModelValue = `import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';

export const GlobalStyle = createGlobalStyle\`
    html, body, #app {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
    }
\`;


const Container = styled.div\`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
\`;

const Navbar = styled.div\`
    display: flex;
    flex-grow: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 64px;
\`;

const Content = styled.div\`
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;    
    width: 100%;
    font-size: 72px;
\`;

const StyledLink = styled(Link)\`
    margin: 8px;
\`;

const Home = () => {
    return <>Home</>;
};

const About = () => {
    return <>About</>;
};

const Profile = () => {
    return <>Profile</>;
};

const App = () => {
    return (
        <HashRouter>
            <GlobalStyle />
            <Container>
                <Navbar>
                    <StyledLink to="/">Home</StyledLink>
                    <StyledLink to="/about">About</StyledLink>
                    <StyledLink to="/profile">Profile</StyledLink>
                </Navbar>
                <Content>
                    <Route exact path='/' component={Home} />
                    <Route path='/about' component={About} />
                    <Route path='/profile' component={Profile} />
                </Content>
            </Container >
        </HashRouter>
    );
}

const root = document.getElementById('app');
ReactDOM.render(<App />, root);
`

export class DefaultInitializationStrategy implements IInitializationStrategy {
	async getInitialState(): Promise<{ [path: string]: string }> {
		return {
			"./main.tsx": `
				import React from 'react';
				import { App } from './App';
				import ReactDOM from 'react-dom';

				ReactDOM.render(<App />, document.getElementById('app'));
			`,
			"./App.tsx": `import { Test } from './Test';
				export const App = () => <div><Test/></div>;
			`,
			"./Test.tsx": `
				export const Test = () => <div>Hello World</div>;
			`,
		}
		// return {
		// 	"./test.tsx": defaultModelValue,
		// }
	}
}