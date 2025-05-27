import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Phone } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function VerificationScreen() {
  const { user, profile, loading, error: authError } = useAuth();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsResendActive(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = text;
      setVerificationCode(newCode);
      
      if (text.length === 1 && index < 5) {
        setActiveInput(index + 1);
      }
    }
  };

  const handleResendCode = () => {
    if (isResendActive) {
      setTimeLeft(60);
      setIsResendActive(false);
      // In a real app, make API call to resend verification code
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      // In a real app, make API call to verify the code
      router.replace('/(tabs)');
    }
  };

  if (!user || !profile) {
    router.replace('/(auth)/login');
    return null;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#1F2937" />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          We've sent verification codes to your email and phone number
        </Text>
      </View>

      {authError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{authError}</Text>
        </View>
      )}

      <View style={styles.methodsContainer}>
        <View style={styles.methodItem}>
          <View style={styles.methodIcon}>
            <Mail size={24} color="#3B82F6" />
          </View>
          <Text style={styles.methodText}>{profile.email}</Text>
        </View>
        
        <View style={styles.methodItem}>
          <View style={styles.methodIcon}>
            <Phone size={24} color="#3B82F6" />
          </View>
          <Text style={styles.methodText}>{profile.phone}</Text>
        </View>
      </View>

      <View style={styles.codeContainer}>
        {verificationCode.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.codeInput,
              activeInput === index && styles.activeCodeInput,
              digit && styles.filledCodeInput
            ]}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            onFocus={() => setActiveInput(index)}
            editable={!loading}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.verifyButtonText}>
          {loading ? 'Verifying...' : 'Verify Account'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          {isResendActive ? "Didn't receive the code? " : `Resend code in ${timeLeft}s`}
        </Text>
        {isResendActive && (
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendButton}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#EF4444',
  },
  methodsContainer: {
    marginBottom: 32,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    color: '#1F2937',
    backgroundColor: '#F8FAFC',
  },
  activeCodeInput: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  filledCodeInput: {
    backgroundColor: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  verifyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  resendButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
});