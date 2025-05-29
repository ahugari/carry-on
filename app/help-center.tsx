import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, ChevronRight, MessageSquare, Book, ShieldCheck, CreditCard, Mail, Phone } from 'lucide-react-native';

const SUPPORT_EMAIL = 'support@carryon.com';
const SUPPORT_PHONE = '+1 (555) 123-4567';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQs: FAQItem[] = [
  {
    question: 'How does CarryOn work?',
    answer: 'CarryOn connects travelers with people who need items delivered. Travelers can earn money by delivering items along their planned routes, while senders save on shipping costs.',
  },
  {
    question: 'How are items and payments protected?',
    answer: 'All items are insured during transit, and payments are held in escrow until successful delivery. We also verify all users and have a comprehensive dispute resolution system.',
  },
  {
    question: 'What items can be transported?',
    answer: 'Legal items that comply with airline and customs regulations. Prohibited items include dangerous goods, illegal items, and items exceeding airline size/weight limits.',
  },
  {
    question: 'How do I get paid?',
    answer: 'Payments are processed through our secure payment system. Once delivery is confirmed, funds are released to your linked payment method within 1-2 business days.',
  },
  {
    question: 'What if something goes wrong?',
    answer: 'We have a dedicated support team and dispute resolution process. Contact us immediately if you encounter any issues, and we\'ll help resolve them.',
  },
];

export default function HelpCenterScreen() {
  const handleEmailSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  const handlePhoneSupport = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };

  const handleChatSupport = () => {
    // TODO: Implement in-app chat support
  };

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
          <View style={styles.supportOptions}>
            <TouchableOpacity 
              style={styles.supportOption}
              onPress={handleEmailSupport}
            >
              <View style={styles.supportIconContainer}>
                <Mail size={24} color="#3B82F6" />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportTitle}>Email Support</Text>
                <Text style={styles.supportDetail}>{SUPPORT_EMAIL}</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.supportOption}
              onPress={handlePhoneSupport}
            >
              <View style={styles.supportIconContainer}>
                <Phone size={24} color="#3B82F6" />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportTitle}>Phone Support</Text>
                <Text style={styles.supportDetail}>{SUPPORT_PHONE}</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.supportOption}
              onPress={handleChatSupport}
            >
              <View style={styles.supportIconContainer}>
                <MessageSquare size={24} color="#3B82F6" />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportTitle}>Live Chat</Text>
                <Text style={styles.supportDetail}>Available 24/7</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {FAQs.map((faq, index) => (
              <View 
                key={index} 
                style={[
                  styles.faqItem,
                  index === FAQs.length - 1 && styles.lastFaqItem,
                ]}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.answer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
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
  supportOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  supportDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastFaqItem: {
    borderBottomWidth: 0,
  },
  question: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  answer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});