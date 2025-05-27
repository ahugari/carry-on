import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard, Ban as Bank } from 'lucide-react-native';

export default function PaymentMethodsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#3B82F6" />
            <Text style={styles.addButtonText}>Add New Card</Text>
          </TouchableOpacity>

          <View style={styles.emptyContainer}>
            <CreditCard size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No cards added yet</Text>
            <Text style={styles.emptyText}>
              Add a credit or debit card to pay for trips and receive payments.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Accounts</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#3B82F6" />
            <Text style={styles.addButtonText}>Add Bank Account</Text>
          </TouchableOpacity>

          <View style={styles.emptyContainer}>
            <Bank size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No bank accounts added</Text>
            <Text style={styles.emptyText}>
              Add a bank account to receive payments directly.
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.infoImage}
          />
          <Text style={styles.infoTitle}>Secure Payments</Text>
          <Text style={styles.infoText}>
            All payment information is encrypted and securely stored. We never share your financial details with other users.
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
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3B82F6',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  infoImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});