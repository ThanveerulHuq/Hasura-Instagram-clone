import React,{ Component } from 'react';
import {AppRegistry, StyleSheet, Text, View ,Platform} from 'react-native';

const apiGetAllFeeds = 'https://randomuser.me/api?results=10';

async function getFeedsfromServer() {
  try {
    let response = await fetch (apiGetAllFeeds);
    let responseJson = await response.json();
    return responseJson.results; //lsit of all data

  } catch (error){

    console.error('Error is : ${error}');

  }
}

export {getFeedsfromServer};
