import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'

const app = new Clarifai.App({
  apiKey: 'a7623e1d9bcc437d876e1bfc60be6a37'
});

const particlesOptions = {
 "particles": {
    "number": {
        "value": 325
    },
    "size": {
        "value": 1
        }
    }
}


class App extends Component {
  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.output[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage')
  const width = Number(image.width)
  const height = Number(image.height)
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
  }
}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box})
}

onInputChange = (event) => {
  this.setState({input: event.target.value})
}


onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models
  .predict(
    "c0c0ac362b03416da06ab3fa36fb58e3", 
    this.state.input)
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(error => console.log(error))
}

  render() {
     return (
      <div className="App">
        <Particles className='particles' 
              params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> 
      </div>
  );
}
  }
 

export default App;
