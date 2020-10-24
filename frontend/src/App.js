import React from 'react';
// Will use BrowserRouter as an alias (named Router)... also the entire return block below must be wrapped in the Router
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap'
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

const App = () => {
  return (
    // empty element (<> = fragment) is all we need for this section right now.
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          {/* the word "exact" @ end makes sure that homepage address ('/') is acurate */}
          <Route path='/' component={HomeScreen} exact />
          {/* the ':id' is a placeholder for product-id - notice exact is not needed for these pages */}
          <Route path='/product/:id' component={ProductScreen}/>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
