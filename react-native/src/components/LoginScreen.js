import React, { Component } from 'react'; 
import {StyleSheet, View,  TouchableOpacity , AsyncStorage, TextInput,Alert, StatusBar,TouchableHighlight } from 'react-native';
import { Container,Content, Item, Input ,Button ,Text ,Footer } from 'native-base';

export default class LoginScrreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : '',
            auth_token: '',

        };
    }


  render() { 
    return (

        // <keyboardAvoidingView behavior='position' >
        <Container>
            <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={"black"}
              
            />

                <Text style={styles.header}> Snapigram </Text>

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
                    onPress={this.login}>
                    <Text style={{color:"#68a0cf"}}>Log In</Text>
                </TouchableOpacity>
               
               
                </View>
              
                
                <Footer style={styles.footer} >
                    
                   <Button
                    onPress={() => {this.props.navigation.navigate('Signup')}} transparent block >
                    <Text uppercase={false} fontWeight={false} style={styles.footertext}>Don't have an account? <Text style={styles.signup}>Signup</Text></Text>
                   {/* </TouchableHighlight> */}
                   </Button>
                   
                </Footer>

        </Container>


        //  </keyboardAvoidingView>
      
         
    );
  
  }  

  login = async () => {
    fetch('https://auth.clipping57.hasura-app.io/v1/login', {
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
        })
        .then((response) => response.json())
        .then((res) => {
            console.log(res)
      if(typeof(res.message) != "undefined"){
       Alert.alert("Error",  res.message);
      }
      else{
        this.setState({ auth_token: res.auth_token });
        Alert.alert("Welcome, "+ res.username, " You have succesfully logged in");
        this.props.navigation.navigate('Main');
        }
     }).catch((error) => {
         console.error(error);
        });
  }

 
}

const styles = StyleSheet.create ({
      
        container : {
            flex :1,
            alignItems : 'center',
            justifyContent : 'center',
            backgroundColor : '#ffffff',
            paddingLeft :40,
            paddingRight :40,
        },

        header :{
            fontSize: 45,
            marginBottom: 30,
            fontFamily : 'Billabong',
            color :'black',
            fontSize :60,
                   
        },
        textInput : {
            alignSelf : 'stretch',
            padding : 12,
            marginBottom :15,
            backgroundColor : '#f7f7f7',
            borderColor: '#d0d0d0',
            borderWidth: 1,
            borderRadius : 8,

        },
        btn : {
            alignSelf : 'stretch',
            padding : 15,
            alignItems : 'center',
            backgroundColor:'#ffffff',
            borderRadius:10,
            borderWidth: 1,
            borderColor: '#68a0cf'
        },

       footertext:{
            
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
        backgroundColor:"#ffffff",
        alignItems: "center",
        height:50
        
       }


      
        

});
