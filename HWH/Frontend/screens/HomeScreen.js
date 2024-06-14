import React, { useRef, useEffect, useState, useCallback } from 'react';  //test123
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList, TextInput } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; //test123
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; //test123
import { FontAwesome as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const flatlistRef = useRef();
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const [entranceMessage, setEntranceMessage] = useState(null); //test123
  //const [exiteMessage, setExitMessage] = useState(null); //test123

  //test123----
  useEffect(() => {
    const fetchEntranceMessage = async () => {
      try {
        const message = await AsyncStorage.getItem('EntranceMessage');
        if (message !== null) {
          setEntranceMessage(message);
        }
      } catch (error) {
        console.error('Error retrieving entrance message:', error);
      }
    };

    const interval = setInterval(fetchEntranceMessage, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);
  //test123----

  useEffect(() => {
    let interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatlistRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      } else {
        flatlistRef.current.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const carouselData = [
    { id: "01", image: require("../assets/images/img1.jpg") },
    { id: "02", image: require("../assets/images/img2.png") },
    { id: "03", image: require("../assets/images/img3.png") },
    { id: "04", image: require("../assets/images/img10.jpg") },
    { id: "05", image: require("../assets/images/img4.png") },

  ];

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{ height: 160, width: screenWidth, marginTop:10 }}
        />
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / screenWidth;
    setActiveIndex(index);
  };

  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => (
      <View
        key={index}
        style={{
          backgroundColor: index === activeIndex ? "blue" : "grey",
          height: 5,
          width: 5,
          borderRadius: 5,
          marginHorizontal: 6,
        }}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <View className="bg-blue-950 w-full p-3 flex-row justify-between" style={{backgroundColor:'#080742',marginTop:30}}>
        <Text className="text-center font-bold" style={{color:'#FF6F00',fontSize:30}}>   HighWay Hub</Text>
        <TouchableOpacity style={{padding:10, left:15}} onPress={()=> navigation.push('user')}>
          <Image source={require('../assets/images/profile.jpg')} style={styles.profileImage}/>
        </TouchableOpacity>
      </View>

      <FlatList
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        style={{margin:7.5, height:180}}
      />

      <View style={styles.dotIndicatorContainer}>
        {renderDotIndicators()}
      </View>


      {/*test123 ----*/}
      <View style={styles.content}>
        <Text style={{color:'#FF6F00'}}>Your Journey Status:</Text>
        <Text placeholder='Vehicle Journey Status' editable={false} style={styles.messageText}>{entranceMessage}</Text>
      </View>
      {/*test123 ----*/}


      <View style={styles.bottomRectangle}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.push('Vregister')}>
          <View style={styles.buttonContent}>
            <Icon name="car" size={25} color="#FF6F00" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Vehicle Registration</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=> navigation.push('QRcodes1')}>
        <View style={styles.buttonContent}>
            <Icon name="qrcode" size={26} color="#FF6F00" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Your QR Codes</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=> navigation.push('ResentTicket')}>
        <View style={styles.buttonContent}>
            <Icon name="ticket" size={26} color="#FF6F00" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Recent Ticket</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=> navigation.push('Payment1')}>
        <View style={styles.buttonContent}>
            <Icon name="credit-card" size={26} color="#FF6F00" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Payment Methods</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('AIhelp')}>
            <MaterialCommunityIcons name="robot-confused-outline" size={60} color="#FF6F00" />
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  dotIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 13,
    marginBottom:10
  },
  bottomRectangle: {
    backgroundColor: '#080742',
    height: 130,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 'auto',
    bottom: 0,
  },
  buttonContainer: {
    marginBottom: 130,
    width: '95%',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: '#E0E0E0',
    padding: 0,
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9'
  },
  buttonText: {
    color: '#080742',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonIcon: {
    right: 0,
    marginRight: 10,
    height: 50,
    width: 50
  },
  buttonContent: {
    flexDirection: 'row',
    right: -30,
    top: 10
  },
  iconContainer: {
    position: 'absolute',
    bottom: -35,
    left: 253,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  content: {
   
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:20, 
    marginBottom:10,
    width:340,
    height:80,
    borderColor: '#FF6F00',
    borderWidth: 3,
  },
  messageText: {
    fontSize: 18,
    color: '#080742',
    textAlign:'center',
  },
});