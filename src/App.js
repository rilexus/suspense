import React, {useEffect} from 'react';

const sleep = async (time = 200) => new Promise((res) => setTimeout(res, time))


const lazy = (factory) => {
  let Component = () => null;
  let status = 'pending';

  // load JS module right away, when lazy is called
  let promise = factory()
      // wait for the JS module to be resolved
      .then((module) => {
        status = 'resolved';
        // get the default export from a file
        Component = module.default
      })
      .catch((e) => {
        // handle error
        status = 'error'
      });

  // return a React component function
  return (props) => {
    useEffect(() => {
      // if still pending, throw to MySuspense to be catched
      if (status === "pending"){
        throw promise;
      }
    }, []);

    return <Component {...props}/>
  }
};

class MySuspense extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };

  }

  componentDidCatch(error, errorInfo) {
    if (error.then){
      this.setState({
        // show fallback
        isLoading: true
      })
      error.then(() => {
        // promise is resolved, render children
        this.setState({
          isLoading: false
        })
      }).catch(e => {
        // handle error
      })
    }
  }

  render() {
    if (this.state.isLoading) {
      return this.props.fallback
    }
    return this.props.children;
  }
}


const LazyComponent = lazy(async () => {
  await sleep(2000); // simulate a long request
  return import('./LazyComponent')
})


function App() {
  return (
    <MySuspense fallback={<h1>Loading...</h1>}>
      <LazyComponent/>
    </MySuspense>
  );
}

export default App;
