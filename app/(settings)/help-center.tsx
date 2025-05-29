import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Mail, MessageSquare, Phone, ChevronRight } from 'lucide-react-native';

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
    <ScrollView style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
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