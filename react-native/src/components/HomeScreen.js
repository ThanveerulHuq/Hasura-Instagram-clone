import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, FlatList , RefreshControl, ScrollView} from 'react-native'
import { Container, Header, Content,Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { getFeedsfromServer } from '../../Networking/Server.js';



export default class HomeGet extends Component {

    constructor(props)
    {
        super(props);
        this.state = ({
          refreshing: false,
          FeedsfromServer : []
        });
    }

    componentDidMount(){
        this.refreshDataFromServer();
    }

    refreshDataFromServer = () => {
      getFeedsfromServer().then((feeds)=>{
        this.setState({FeedsfromServer : feeds});
        this.setState({ refreshing : false });
      }).catch((error) =>
       {
         this.setState({ FeedsfromServer : []});
         this.setState({ refreshing : false });

       });

       onRefresh = () => {
         this.refreshDataFromServer();
       }

    }


  render() {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={this.state.FeedsfromServer}

        renderItem={({ item ,index}) => (
          <ScrollView>

            <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>

              <Image
                style={{ width: 36, height: 36, margin: 12, borderRadius: 18, borderColor: 'lightgray' }}
                source={{ uri: item.picture.thumbnail }}
              />


              <Text style={{ fontWeight: 'bold',marginTop:15,padding:5}}>{
                item.login.username}</Text>
                  <Right>
                  <Icon name="md-more"  style={{color: '#a9a9a9',padding:10,fontSize: 30}}/>
                  </Right>

            </View>

            <Image source={{uri:item.picture.large}} style={{height: 350, width: null, flex: 1}}/>

            <View style={{ height: 54, backgroundColor: 'white', flexDirection: 'row' }}>
              <Ionicons name="ios-heart-outline" size={34} color="black" style={{ marginTop: 12, marginLeft: 15 }} />
              <Ionicons name="ios-text-outline" size={34} color="black" style={{ marginTop: 12, marginLeft: 20 }} />
              <Ionicons name="ios-send-outline" size={34} color="black" style={{ marginTop: 12, marginLeft: 20 }} />
              <View style={{ flex: 1 }} />
              <Ionicons name="ios-bookmark-outline" size={34} color="black" style={{ marginTop: 12, marginRight: 15 }} />
            </View>

            <View style={{ marginBottom: 20, paddingLeft: 15 }}>
              <Text style={{ fontSize: 12, color: 'gray' }}>{'FEW MINUTES AGO'}</Text>
            </View>
          </ScrollView>
        )}

        keyExtractor={(item, index) => item}
        refreshControl =  {
          <RefreshControl
              refreshing = {this.state.refreshing}
              onRefresh = {this.onRefresh}
            />
        }

      />

    )
  }
}
