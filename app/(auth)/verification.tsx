import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Check, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function VerificationScreen() {
  const { session } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    address: false,
    social: false
  });
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('verification_status')
      .eq('id', session.user.id)
      .single();

    if (data?.verification_status) {
      setVerificationStatus(data.verification_status);
    }
  };

  const sendEmailVerification = async () => {
    setLoading(true);
    try {
      // In a real app, integrate with your email service provider
      // For now, we'll simulate the verification
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      Alert.alert('Verification Code', `Your email verification code is: ${code}`);
      // Store the code securely (in a real app, this should be done server-side)
      await supabase
        .from('verification_codes')
        .insert([{ user_id: session?.user.id, type: 'email', code }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code');
    }
    setLoading(false);
  };

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('verification_codes')
        .select('code')
        .eq('user_id', session?.user.id)
        .eq('type', 'email')
        .single();

      if (data?.code === emailCode) {
        await supabase
          .from('profiles')
          .update({
            verification_status: { ...verificationStatus, email: true }
          })
          .eq('id', session?.user.id);

        setVerificationStatus(prev => ({ ...prev, email: true }));
        Alert.alert('Success', 'Email verified successfully');
    } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify email');
    }
    setLoading(false);
  };

  const sendPhoneVerification = async () => {
    setLoading(true);
    try {
      // In a real app, integrate with SMS service provider
      // For now, we'll simulate the verification
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      Alert.alert('Verification Code', `Your phone verification code is: ${code}`);
      await supabase
        .from('verification_codes')
        .insert([{ user_id: session?.user.id, type: 'phone', code }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code');
    }
    setLoading(false);
  };

  const verifyPhone = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('verification_codes')
        .select('code')
        .eq('user_id', session?.user.id)
        .eq('type', 'phone')
        .single();

      if (data?.code === phoneCode) {
        await supabase
          .from('profiles')
          .update({
            verification_status: { ...verificationStatus, phone: true }
          })
          .eq('id', session?.user.id);

        setVerificationStatus(prev => ({ ...prev, phone: true }));
        Alert.alert('Success', 'Phone verified successfully');
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify phone');
    }
    setLoading(false);
  };

  const verifyAddress = async () => {
    // In a real app, integrate with Plaid or similar service
    // For now, we'll simulate the verification
    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          verification_status: { ...verificationStatus, address: true }
        })
        .eq('id', session?.user.id);

      setVerificationStatus(prev => ({ ...prev, address: true }));
      Alert.alert('Success', 'Address verified successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify address');
    }
    setLoading(false);
  };

  const handleContinue = () => {
    if (verificationStatus.email && verificationStatus.phone && verificationStatus.address) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Incomplete Verification', 'Please complete all required verifications');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>Complete these steps to start using the app</Text>

      {/* Email Verification */}
      <View style={styles.verificationItem}>
        <View style={styles.itemHeader}>
          <Mail size={24} color="#64748B" />
          <Text style={styles.itemTitle}>Email Verification</Text>
          {verificationStatus.email && <Check size={24} color="#22C55E" />}
        </View>
        {!verificationStatus.email && (
          <View style={styles.verificationContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={emailCode}
              onChangeText={setEmailCode}
              keyboardType="number-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={sendEmailVerification}
                disabled={loading}>
                <Text style={styles.buttonText}>Send Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={verifyEmail}
                disabled={loading || !emailCode}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        </View>
        
      {/* Phone Verification */}
      <View style={styles.verificationItem}>
        <View style={styles.itemHeader}>
          <Phone size={24} color="#64748B" />
          <Text style={styles.itemTitle}>Phone Verification</Text>
          {verificationStatus.phone && <Check size={24} color="#22C55E" />}
        </View>
        {!verificationStatus.phone && (
          <View style={styles.verificationContent}>
          <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={phoneCode}
              onChangeText={setPhoneCode}
            keyboardType="number-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={sendPhoneVerification}
                disabled={loading}>
                <Text style={styles.buttonText}>Send Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={verifyPhone}
                disabled={loading || !phoneCode}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Address Verification */}
      <View style={styles.verificationItem}>
        <View style={styles.itemHeader}>
          <MapPin size={24} color="#64748B" />
          <Text style={styles.itemTitle}>Address Verification</Text>
          {verificationStatus.address && <Check size={24} color="#22C55E" />}
        </View>
        {!verificationStatus.address && (
      <TouchableOpacity 
            style={[styles.button, styles.fullWidthButton]}
            onPress={verifyAddress}
            disabled={loading}>
            <Text style={styles.buttonText}>Verify with Plaid</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!verificationStatus.email ||
            !verificationStatus.phone ||
            !verificationStatus.address) &&
            styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={
          !verificationStatus.email ||
          !verificationStatus.phone ||
          !verificationStatus.address ||
          loading
        }>
        <Text style={styles.continueButtonText}>Continue to App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  verificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  verificationContent: {
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
  },
  fullWidthButton: {
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  continueButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});