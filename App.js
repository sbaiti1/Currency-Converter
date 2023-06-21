import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView   ,TouchableOpacity ,  Alert , Button, StyleSheet, Text, ScrollView , Image, View, TextInput } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

//feel free to use my API Key
const Base_URL = 'https://v6.exchangerate-api.com/v6/1d07ae4a1426fefab28d3257/latest/USD'


export default function App() {
  const [amount , setAmount] = useState() ;
  const [targetAmount, setTargetAmount] = useState(0);
  const [conversion_rates , setRates] = useState([]) ;
  const [currencyKeys, setcurrencyKeys] = useState([]);
  const [selected, setSelected] = useState();
  const [targetCurrency, setTargetCurrency] = useState();

 //converting currency function
 const convertCurrency = (amount, fromCurrency, toCurrency) => {
  const amountInUSD = parseFloat(amount)  / conversion_rates[fromCurrency];
  const convertedAmount = amountInUSD * conversion_rates[toCurrency];
  setTargetAmount(parseFloat(convertedAmount))
  
};


  //handle change of the amount of money
  
const handleChange = (newAmount) => {
  setAmount(newAmount);
};

useEffect(() => {
  console.log("selected amount is", parseFloat(amount));
  
  if (selected && targetCurrency) {
    convertCurrency(amount, selected, targetCurrency);
  }
}, [amount, selected, targetCurrency]);
  

  //switch currencies
  const switchCurrency = () => {
    setSelected(targetCurrency);
    setTargetCurrency(selected);
    
  };
  

  //get conversions rates from the api

  const fetchExchangeRates = async ()=>{

    try{
      const res = await axios.get(Base_URL)
      const data = res.data.conversion_rates
      setRates(data) 
      const arrayOfCurencies = Object.keys(conversion_rates).map((item  , i)=>({
        key : i , 
        value : item
      }))
      setcurrencyKeys(arrayOfCurencies);
      //console.log("here the key value" , currencyKeys);
    
      

    } catch(error){
      console.log("an error while fetching data" , error);
    }
  }

  useEffect(()=>{fetchExchangeRates()} , [])

 console.log(conversion_rates);
  

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Currency Converter</Text>
      <Text style={styles.p}>Check live rates, set rate alerts, receive notifications and more.</Text>
      
       <View style={styles.exchange}>
        <Text style={styles.smallText} >Amount</Text>
        <View style={styles.select}>
         
          <SelectList 

            style={styles.currency}
              setSelected={(val) => setSelected(val)} 
              data={currencyKeys} 
              save="value"
          />
          <TextInput keyboardType="numeric" defaultValue="1000.00" value={amount } onChangeText={handleChange} style={ styles.input } />
        </View>
        {/* Divider + switch */}
        <View style={styles.divider}>
      <View style={styles.line} />
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={switchCurrency}>
        <Image source={require('./icon.jpg')} style={styles.icon} />

        </TouchableOpacity>
      </View>
      <View style={styles.line} />
    </View>

    {/* converting result */}

    <Text style={styles.smallText} >Converted Amount</Text>

    <View style={styles.select}>
         
          <SelectList 
              setSelected={(val) => setTargetCurrency(val)} 
              data={currencyKeys} 
              save="value"
          />
          <Text style={ styles.input }> {targetAmount.toFixed(2)} </Text>
        </View>
        
       </View>
      <View style={{marginTop : 25}}>


        <Text style={styles.smallText}>Indicative Exchange Rate</Text>
        {(targetCurrency && amount && selected) && <Text style={{fontSize : 18 , fontWeight : 500}} > {`1 ${selected} = ${(targetAmount/amount).toFixed(4)} ${targetCurrency}`} </Text>}
      </View>

      <StatusBar style="auto" />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor : "#f1f5f9"  ,
    alignItems : 'center'
  },
  scrollView: {
    marginTop : 40 ,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 20,
    
  },
  title : {
    color : '#2563eb' , 
    fontSize : 30 , 
    fontWeight : "500" , 
    textAlign : "center"

  } , 
  button : {
    backgroundColor : '#000' , 
    padding : '10pt 20pt'
  } , 
  p : {
    color : "#808080" ,
    fontSize : 17 , 
    textAlign :  "center" , 
    paddingTop : 5

    
  } , 
  exchange : {
      marginTop : 50 ,
      minHeight : 350 , 
      width : 365 ,
      backgroundColor : "#fff" , 
      borderRadius : 20 ,
      paddingLeft : 27 , 
      paddingRight : 27
  } , 
  smallText : {
    color : "#989898" , 
    fontSize : 18 ,
    //padding : 20 , 
    paddingTop : 15 , 
    paddingBottom: 15
  } ,
  select : {
    flexDirection : 'row' , 
    alignItems : 'center'
  } ,
  flag : {
    //marginLeft : 30
  } , 
  currency : {
    fontSize : 25 , 
    fontWeight : "600" , 
    color : "#020617" , 
    paddingLeft : 10 , 
    textTransform : 'uppercase'
  } ,
  input: {
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
    padding : 10 ,
    paddingLeft: 50,
    paddingRight: 35,
    fontSize : 20 ,

    marginLeft : "auto"
  } , 

  divider: {
    marginTop : 35 , 
    marginBottom : 35 , 
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7E7EE',
  },
  iconContainer: {
    marginHorizontal: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  
});
