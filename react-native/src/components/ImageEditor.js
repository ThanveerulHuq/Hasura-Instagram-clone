import React, { Component } from "react";
import {  Image ,StyleSheet} from 'react-native';
import { Container,View, Header,Footer, Input,Title, Content, Button, Icon, Text, Right, Body,Form,Item } from "native-base";

export default class extends Component {

  constructor(props) {
    super(props)

    this.state = {

      imageData : this.props.navigation.state.params.imageData,
        
    };
  }



  render() {
   
    let { imageData } = this.state;
    const imageUri = this.state.imageData.uri;
    const image64 = `data:image/jpg;base64,`+ imageData.base64;
    
    console.log(this.state.imageData);
       
    return (
      <Container style={styles.Container}>
          <View style={styles.form}> 

              
            {/* <Text style={{fontFamily:'Billabong',fontWeight: 'bold',fontSize:20}}>ImageURI = {imageData.uri}</Text> */}
              <Image style={styles.image}
                    source={{uri:image64}}
                />
          
                <View style={styles.input}>
                    
                    <Item>
                  
                      <Input style={styles.input1} placeholder="Write a caption....." multiline />

                    </Item>

                    <Item>
                  
                        <Input style={styles.input1} placeholder="Tag People" />

                    </Item>
                    
                    
                </View>

      
          </View>


          <View style={{flex: 1,flexDirection: 'row', paddingTop:5, justifyContent: 'center', alignItems: 'center'}}>
            <Button style={styles.button}  onPress={() => {this.props.navigation.navigate('Main')}}>
            <Text >Post Image</Text>
            </Button>
          </View>
          
      </Container>
    );
  }
}

const styles = StyleSheet.create
    ({
      Container: {
        flex:1,
        backgroundColor:'white',
      
    },
    input1 :{
      flex:1,
      height:70,
     
    },
    input :{
      paddingLeft:0,
      flex:2
    },
    image :{
      margin:5,
      height :140,
      width :140,
      flex:1,
    
      

    },
    form:{
      flex:1,
      flexDirection :'row',
    },

    button:{
      

    }
    

    })