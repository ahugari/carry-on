import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, ChevronRight, MessageSquare, Book, ShieldCheck, CreditCard } from 'lucide-react-native';

export default function HelpCenterScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help articles..."
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          
          <TouchableOpacity style={styles.topicItem}>
            <View style={styles.topicIcon}>
              <MessageSquare size={24} color="#3B82F6" />
            </View>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>Getting Started</Text>
              <Text style={styles.topicDescription}>Learn how to use the app and create your first trip</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem}>
            <View style={styles.topicIcon}>
              <Book size={24} color="#3B82F6" />
            </View>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>Booking Process</Text>
              <Text style={styles.topicDescription}>Understanding how to book and manage trips</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem}>
            <View style={styles.topicIcon}>
              <ShieldCheck size={24} color="#3B82F6" />
            </View>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>Safety & Security</Text>
              <Text style={styles.topicDescription}>Learn about our safety measures and policies</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem}>
            <View style={styles.topicIcon}>
              <CreditCard size={24} color="#3B82F6" />
            </View>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>Payments & Refunds</Text>
              <Text style={styles.topicDescription}>Information about payments, fees, and refund policies</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity style={styles.contactButton}>
            <MessageSquare size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Chat with Support</Text>
          </TouchableOpacity>

          <Text style={styles.supportText}>
            Our support team is available 24/7 to help you with any questions or concerns.
          </Text>
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicContent: {
    flex: 1,
    marginRight: 8,
  },
  topicTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  topicDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  supportText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});