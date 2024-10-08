import { useStripe } from "@stripe/stripe-react-native";
import { View, Text, TextInput, Button, Alert, BackHandler } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';
import PaymentStatus from "./PaymentStatus";


const PaymentAmount = () => {
  const navigation = useNavigation();
  const URL = CONFIG.CONNECTION_URL;

  const stripe = useStripe();
  const [ticketAmount, setTicketAmount] = useState(null);

  /////
  useEffect(() => {
    const fetchTicketAmount = async () => {
        const amount = await AsyncStorage.getItem('ticketprice');
        setTicketAmount(parseFloat(amount)); // Parse the ticket price from storage
    };
    fetchTicketAmount();
}, []);
  /////

  const paying = async () => {
      try {
        /////
        const amount = ticketAmount * 100;
        /////
        //sending request
        const response = await fetch (`${URL}/pay`, { //here, put your own phone's IP address to make it work.... http://--:--:--:--:8080/pay
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();

        if(!response.ok) return Alert.alert(data.message);
        const clientSecret = data.clientSecret;

        const initSheet = await stripe.initPaymentSheet({
           paymentIntentClientSecret: clientSecret,
           merchantDisplayName: 'hwh', // where were you my guardian angel...
        });

        if (initSheet.error) return Alert.alert(initSheet.error.message);
        const presentSheet = await stripe.presentPaymentSheet({
            clientSecret,
        });

        if(presentSheet.error) return Alert.alert(presentSheet.error.message);
        await AsyncStorage.setItem('paymentStatus', 'Payment Completed');
        Alert.alert("Payment Complete, Thank you!");
        navigation.navigate('PaymentStatus');
      
      } catch (err){
          console.error(err);
          await AsyncStorage.setItem('paymentStatus', 'Payment Incomplete');
          Alert.alert("Something went wrong, try again later!");
          navigation.navigate('PaymentF');
      }
  }

  
  useEffect(() => {
    

    const getTicketAmount = async () => {
      try {
        const amount = await AsyncStorage.getItem('ticketAmount');
        setTicketAmount(amount);
      } catch (error) {
        console.error('Error getting ticket amount:', error);
      }
    };

   
    getTicketAmount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Disable back button
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  

  return (
    <View style={{ marginTop:25, width:"100%", height:"100%"}}>
      <StatusBar style='dark'/>
      <View style={{backgroundColor:'#080742', height:65, marginBottom:15}}>
        <Text  style={{color:'#FF6F00', fontSize:18, textAlign:"center", padding:18, fontWeight:"bold"}}>HighWay Hub</Text>
      </View>

     <View style={{backgroundColor:'#FF6F00',height:35, marginBottom:100}}>
        <Text style={{color:'#080742',fontSize:18, textAlign:"center", padding:5,fontWeight:"bold"}}>Payment</Text>
      </View>
      <Text style={{marginTop: 20, marginLeft:20, fontSize:20, color:'#080742', marginBottom:30}}> Amount: </Text>
      <Text style={{marginTop: 30, textAlign: 'center', color:'#080742', fontSize:30, marginBottom:80}}> RS. {ticketAmount}</Text> 
      {/*<Text style={{marginTop: 30, color:'#080742', fontSize:15, marginLeft:20,}}>Pay by:</Text>*/}
      
      
    <View style={{width:'70%' , left:'15%', }}>
      <Button title="Pay" onPress={paying} color="#080742" />
    </View>
    
    <View style={{marginBottom:80}}>
    </View>

    </View>
  );
};

export default PaymentAmount;
