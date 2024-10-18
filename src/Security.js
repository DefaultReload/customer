import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AccountNav from './AccountNav'; // Make sure the path is correct

const Security = () => {
  return (
    <div>
    <AccountNav />
      <p>Security</p>
      <p>Enable Passkeys</p>
      <p>Request to Delete Account</p>
    </div>
  )
}

export default Security

const styles = StyleSheet.create({})