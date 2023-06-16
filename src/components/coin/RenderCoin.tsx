import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { DataItem } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { getValueAndColor, getVariables } from '../../utils';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS, FONTS } from '../../constants/theme';
import { Database } from '../../sqlite-storage/database';

type props = {
  item: DataItem;
  handleNavigationToCoinScreen: () => void;
};
const RenderCoin: React.FC<props> = ({
  item,
  handleNavigationToCoinScreen,
}) => {
  const {
    symbol,
    lastPrice: initialLastPrice,
    volume: initialVolume,
    prev,
  } = item;
  const COIN_SYMBOL = React.useMemo(
    () =>
      symbol.replace('USDT', '').toLowerCase()[0].toUpperCase() +
      symbol.replace('USDT', '').toLowerCase().slice(1),
    [symbol]
  );
  const [cryptoName, setCryptoName] = useState<string>('');
  const priceVar = React.useMemo(
    () => ({
      ...getValueAndColor(initialLastPrice, prev?.lastPrice),
      ...getVariables(initialLastPrice, prev?.lastPrice),
    }),
    [initialLastPrice]
  );
  const volumeVar = React.useMemo(
    () => ({
      ...getValueAndColor(initialVolume, prev?.volume),
      ...getVariables(initialVolume, prev?.volume),
    }),
    [initialVolume]
  );

  const getCryptoName = async () => {
    try {
      const name = await Database.getInstance().getCryptoName(
        COIN_SYMBOL.toLowerCase()
      );
      const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1);
      const updatedName = upperCaseName.slice(0, 10);
      if (updatedName.length < upperCaseName.length) {
        setCryptoName(updatedName + '...');
      } else {
        setCryptoName(updatedName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (COIN_SYMBOL && cryptoName === '') {
      getCryptoName();
    }
  }, [COIN_SYMBOL]);
  return (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.blackPure,
        height: 100,
        padding: 10,
        paddingRight: 0,
        marginTop: 5,
        borderRadius: 10,
      }}
      onPress={handleNavigationToCoinScreen}
    >
      <Image
        source={{
          uri: `https://coinicons-api.vercel.app/api/icon/${symbol
            .replace('USDT', '')
            .toLowerCase()}`,
        }}
        style={{
          width: 60,
          height: 60,
          opacity: 0.8,
          borderRadius: 50,
        }}
      />

      <View
        style={{
          width: 100,
        }}
      >
        <Text
          style={[
            FONTS.h4,
            {
              color: COLORS.white,
              fontWeight: 'bold',
            },
          ]}
        >
          {COIN_SYMBOL}
        </Text>
        <Text
          style={[
            FONTS.h4,
            {
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: 12,
              opacity: 0.8,
              textAlign: 'left',
            },
          ]}
        >
          {cryptoName}
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 200,
        }}
      >
        <Text
          style={[FONTS.body4, { color: COLORS.white, fontWeight: 'bold' }]}
        >
          {priceVar.isChanged ? (
            <Icon
              name={priceVar.icon}
              size={15}
              color={
                priceVar.sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary
              }
              style={priceVar.sign !== '-' ? { top: 10 } : {}}
            />
          ) : null}
          {priceVar.isChanged ? '  $ ' : '$ '} {priceVar.commanPrefix}
          {priceVar.isChanged ? (
            <Text style={{ color: priceVar.color }}>
              {priceVar.nextValueSuffix}
              {' ( ' + priceVar.percent.toFixed(2) + ' )%'}
            </Text>
          ) : null}
        </Text>

        <Text
          style={[
            FONTS.body4,
            { color: COLORS.white, fontWeight: 'bold', marginTop: 5 },
          ]}
        >
          {/* 
          
          If Need to show volume in coin screen in future - @kushagra1212 
          
          {volumeVar.isChanged ? (
            <Icon
              name={volumeVar.icon}
              size={20}
              color={
                volumeVar.sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary
              }
              style={volumeVar.sign !== '-' ? { marginTop: 3 } : {}}
            />
          ) : null} 
          
          
          */}
          {volumeVar.commanPrefix}
          {volumeVar.isChanged ? (
            <Text style={{ color: volumeVar.color }}>
              {volumeVar.nextValueSuffix}
              {/*
              
              If Need to show volume in coin screen in future - @kushagra1212 
              
              {' ( ' + volumeVar.percent.toFixed(2) + ' )%'} 
              
              */}
            </Text>
          ) : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderCoin;
