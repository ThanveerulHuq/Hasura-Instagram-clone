import React, { Component } from 'react';
import {StyleSheet, View , Image ,  TextInput,TouchableOpacity,Alert, TouchableHighlight, ScrollView} from 'react-native';

import {  Container, Header, Content, Input, Item , Text,Footer ,Button } from 'native-base';

export default class RegularTextboxExample extends Component {

  state = {
    Fullname:'',
    Email:'',
    username: '',
    password: '',
    auth_token: ''
  }



Signup = async () => {
  fetch('https://auth.clipping57.hasura-app.io/v1/signup', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "provider": "username",
      "data": {
      "username": this.state.username,
      "password": this.state.password
      }
      })
  }).then((response) => response.json())
  .then((res) => {
    console.log(res)
    if(typeof(res.message) != "undefined"){
    Alert.alert("Error signing up",  res.message);
    }
    else{
    this.setState({ auth_token: res.auth_token });
    Alert.alert("Success", "You have succesfully signed up , now you can Login with your ");
    this.props.navigation.navigate('Login');
    }
  }).catch((error) => {
  console.error(error);
  });
}
 

  render() {
    return (
      
      <Container style={styles.container} >
         
         <Image source={require('../assets/signuppic.png')} style={styles.pic}/>
        
         <View style={styles.content}>
         
               <TextInput 
                        style={styles.textInput} placeholder='Email Id'
                        
                        onChangeText = { (Email)=> this.setState({Email}) }
                        underlineColorAndroid = 'transparent'
                /> 
                <TextInput 
                        style={styles.textInput} placeholder='Full Name'
                        
                        onChangeText = { (Fullname)=> this.setState({Fullname}) }
                        underlineColorAndroid = 'transparent'
                /> 

                <TextInput 
                        style={styles.textInput} placeholder='Username'
                        onChangeText = { (username)=> this.setState({username}) }
                        underlineColorAndroid = 'transparent'
                />

                <TextInput 
                        style={styles.textInput} placeholder='Password'
                        secureTextEntry = {true}
                        onChangeText = { (password)=> this.setState({password}) }
                        underlineColorAndroid = 'transparent'
                /> 

               
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.Signup}>
                    <Text style={{color:"#68a0cf"}}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.footerabovetext}>
                  <Text style={styles.footertext}>By signing up, you agree to our</Text>
                  <Text style={styles.termstext}>Terms & Privacy Policy.</Text>
                </View>
                </View>
                <Footer style={styles.footer }  >
                   
                   <Button
                    onPress={() => {this.props.navigation.navigate('Login')}} transparent 
                    >

                    <Text  uppercase={false}  style={styles.footertext}>Already have an account? <Text style={styles.signup} >Log in.</Text></Text>
                   
               
                   </Button>
                </Footer>

        
      </Container>
      
    );
  }
}


const styles = StyleSheet.create ({

    container:{
    flex:1 ,
    backgroundColor:"#fff",
    justifyContent:'center',
    alignItems:'center'
    },

    pic:{
      marginTop:30,
      marginBottom:15,
      height:150,
      width:150,
    },
    
    content:{
      flex:1,
      width:300,
      alignContent:"space-between",
    },
    textInput : {
      alignSelf : 'stretch',
      padding : 8,
      marginBottom :10,
      backgroundColor : '#f7f7f7',
      borderColor: '#d0d0d0',
      borderWidth: 1,
      borderRadius : 5,

  },
    btn : {
      alignSelf : 'stretch',
      padding : 10,
      alignItems : 'center',
      backgroundColor:'#fff',
      borderRadius:5,
      borderWidth: 1,
      borderColor: '#68a0cf'
  },
  footerabovetext : {
    padding:10,

  },
  termstext:{
    textAlign:'center',
    color:'#949699',
    fontWeight:'400',
    fontSize:14,
    
  },
 footertext:{
    textAlign:'center',
     fontSize:14,
     color:'#d0d0d0',
     fontWeight:'normal',
  },
  signup:{
      fontWeight:'900',
      color:'#949699',
      fontSize:13,
      
  },

 footer:{
      borderTopWidth: 1,
      borderColor: '#d0d0d0',
      backgroundColor:"#fff",
      alignItems: "center",
      height:50,
      width:"100%",
      
  
 }
  

})