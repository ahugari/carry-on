import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: object; // Added to allow passing custom styles
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style = {},
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style, // Apply custom styles
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? '#FFFFFF' : '#3B82F6'} // Adjusted spinner color for better visibility
            style={icon ? styles.spinnerWithIcon : styles.spinnerOnly} // Adjust spinner margin based on icon presence
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={textStyles}>{children}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Ensure icon and text are in a row by default on the button itself
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primary: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: '#EFF6FF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CBD5E1', // Softer border for outline
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  // States
  disabled: {
    backgroundColor: '#E2E8F0', // More prominent disabled state
    opacity: 0.7, // Keep opacity for text and icon
  },
  // Text styles
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#3B82F6',
  },
  outlineText: {
    color: '#374151', // Darker text for outline for better readability
  },
  ghostText: {
    color: '#3B82F6',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  disabledText: {
    // For primary disabled button, text should remain white or light gray
    // For other variants, adjust as needed. Assuming disabled style handles button background.
     color: '#94A3B8',
  },
  spinnerWithIcon: {
    marginRight: 8,
  },
  spinnerOnly: {
    // No margin if only spinner is shown
  },
}); 