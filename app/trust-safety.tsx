import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Shield, UserCheck, CircleAlert as AlertCircle, Lock } from 'lucide-react-native';

export default function TrustSafetyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Trust & Safety</Text>
      </View>

      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.heroImage}
        />

        <View style={styles.section}>
          <View style={styles.featureCard}>
            <Shield size={32} color="#3B82F6" />
            <Text style={styles.featureTitle}>Secure Platform</Text>
            <Text style={styles.featureText}>
              Our platform is built with multiple layers of security to protect your personal and financial information.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <UserCheck size={32} color="#3B82F6" />
            <Text style={styles.featureTitle}>Verified Users</Text>
            <Text style={styles.featureText}>
              All users go through a thorough verification process to ensure a safe and trusted community.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Lock size={32} color="#3B82F6" />
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureText}>
              All transactions are processed through our secure payment system with fraud protection.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Guidelines</Text>
          
          <View style={styles.guidelineItem}>
            <View style={styles.guidelineNumber}>
              <Text style={styles.numberText}>1</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>Verify Identities</Text>
              <Text style={styles.guidelineText}>
                Always check user profiles and reviews before making arrangements.
              </Text>
            </View>
          </View>

          <View style={styles.guidelineItem}>
            <View style={styles.guidelineNumber}>
              <Text style={styles.numberText}>2</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>Communicate Through App</Text>
              <Text style={styles.guidelineText}>
                Keep all communications within our platform for your safety.
              </Text>
            </View>
          </View>

          <View style={styles.guidelineItem}>
            <View style={styles.guidelineNumber}>
              <Text style={styles.numberText}>3</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>Meet in Safe Places</Text>
              <Text style={styles.guidelineText}>
                Choose public locations for item handovers and meetings.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.reportSection}>
          <AlertCircle size={24} color="#EF4444" />
          <Text style={styles.reportTitle}>Report an Issue</Text>
          <Text style={styles.reportText}>
            If you encounter any suspicious activity or safety concerns, please report them immediately.
          </Text>
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportButtonText}>Contact Safety Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  featureCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  guidelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  guidelineNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#3B82F6',
  },
  guidelineContent: {
    flex: 1,
  },
  guidelineTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  guidelineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  reportSection: {
    margin: 16,
    padding: 24,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    alignItems: 'center',
  },
  reportTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#EF4444',
    marginTop: 12,
    marginBottom: 8,
  },
  reportText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  reportButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});