import React from 'react';
import { Text, View, TouchableOpacity,Vibration ,CameraRoll, Image} from 'react-native';
import { Button ,Footer,FooterTab} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Camera, Permissions, ImagePicker } from 'expo';

export default class CameraExample extends React.Component {
  state = {
    image: null,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photoId:1,
    ratio: '16:9',

  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }



  // takePicture = async function() {
  //   if (this.camera) {
  //     let photo = await this.camera.takePictureAsync().then(
        
  //         console.log(photo),
  //         Vibration.vibrate())
  //   }
  // };
// =---------------------------

takePicture = async function() {
  if(this.camera) {
    this.camera.takePictureAsync().then(data => {
        CameraRoll.saveToCameraRoll(data.uri);
    }).then(() => {
      this.setState({
        photoId: this.state.photoId + 1,
        
      });
      Vibration.vibrate();
      
    });
  }
};

  // takePicture = async function() {
  //   if (this.camera) {
  //     this.camera.takePictureAsync().then(data => {
  //       let saveResult = CameraRoll.saveToCameraRoll(data);
  //       console.log(saveResult)
  //       Vibration.vibrate();
  //     });
  //   }
  // };


  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64 :true,
    });

    
    this.onImageDataResolved(result);
    console.log(result);
    

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
   

  };

 onImageDataResolved(imageData) 
    {
    this.props.navigation.navigate('ImageEditor', {imageData});
    }

  render() {

    let { image } = this.state;
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 ,}}>
          <Camera style={{ flex: 4,}} type={this.state.type} ref={ref => { this.camera = ref; }}  ratio={this.state.ratio}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>

          
          
          <Footer style={{  flex: 1,backgroundColor:'white' }}>
               
             <FooterTab style={{marginLeft:125,backgroundColor:'white'}}>
               
              <Button transparent  onPress={this.takePicture.bind(this)}>

                <Icon  name='camera-iris' style={{fontSize:65  }}/>

              </Button>
               

              <Button transparent  onPress={this.pickImage.bind(this)} >

                <Icon  name='image' style={{color:'black',fontSize:50 }}/>

              </Button>
              
             

              
          </FooterTab>
             
          </Footer>
        
        </View>

        
      );
    }
  }
}