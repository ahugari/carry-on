import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';

interface CardProps {
  onPress?: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  rating?: number;
  verificationLevel?: 'basic' | 'verified' | 'premium';
  children?: React.ReactNode;
  style?: object; // Allow passing custom styles to the outer container
}

export function Card({
  onPress,
  title,
  subtitle,
  description,
  image,
  rating,
  verificationLevel,
  children,
  style = {},
}: CardProps) {
  const VerificationBadge = () => {
    let color = '#64748B'; // basic
    if (verificationLevel === 'verified') color = '#3B82F6';
    if (verificationLevel === 'premium') color = '#8B5CF6';

    return verificationLevel ? (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>
          {verificationLevel.charAt(0).toUpperCase() + verificationLevel.slice(1)}
        </Text>
      </View>
    ) : null;
  };

  const cardContent = (
    <View style={[styles.container, image ? {} : styles.noImageContainer, style]}>
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {verificationLevel && <VerificationBadge />}
          </View>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        {rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
        {children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.touchable, style]} // Apply custom style here as well for touchable wrapper
        onPress={onPress}
        activeOpacity={0.8} // Standard active opacity
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent; // This will already have the style from cardContent's View
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    // shadowColor: '#000000', // Deprecated
    // shadowOffset: { width: 0, height: 2 }, // Deprecated
    // shadowOpacity: 0.05, // Deprecated
    // shadowRadius: 4, // Deprecated
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', // Web equivalent
    elevation: 3, // Android shadow
    margin: 4, // Added margin for better spacing when multiple cards are listed
  },
  container: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden', // Ensures image corners are rounded if image is present
  },
  noImageContainer: {
    // Styles for cards without an image, potentially different padding or layout if needed
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    flexShrink: 1, // Allow title to shrink if badge is present
    marginRight: 8, // Add some space if badge is present
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    // marginLeft: 8, // Removed, titleContainer handles spacing
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151', // Slightly darker for better readability
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: { // Renamed from rating to ratingContainer for clarity
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // Add some space above rating if description is short or absent
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 4,
  },
  childrenContainer: {
    marginTop: 12, // Add space if there are children elements
  },
}); 