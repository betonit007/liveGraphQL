import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Test from './components/Test'
import Login from './components/Login'

//https://www.apollographql.com/docs/react/networking/authentication/ 
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

let authtoken = null

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WEB_SOCKET_ENDPOINT,
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = setContext((_, { headers }) => {

  authtoken = localStorage.getItem('AUTH_TOKEN')
  console.log(authtoken)
  return {
    headers: {
      ...headers,
      authtoken
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache()
});

const App = () => {

  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path='/' component={Test} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

export default App



//5. Authenticate over WebSocket (optional)

// import { WebSocketLink } from '@apollo/client/link/ws';

// const wsLink = new WebSocketLink({
//   uri: 'ws://localhost:4000/subscriptions',
//   options: {
//     reconnect: true,
//     connectionParams: {
//       authToken: user.authToken,
//     },
//   },
// });