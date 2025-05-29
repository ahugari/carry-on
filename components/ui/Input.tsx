import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextInputProps['style']; // Correct type for TextInput style
  onRightElementPress?: () => void; // Optional handler for pressing the right element
}

export function Input({
  label,
  error,
  icon,
  rightElement,
  containerStyle,
  inputStyle,
  onRightElementPress,
  ...props
}: InputProps) {
  const RightElementWrapper = onRightElementPress ? TouchableOpacity : View;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View 
        style={[
          styles.inputWrapper,
          error && styles.inputError,
          props.multiline && styles.multilineInputWrapper // Add specific style for multiline
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon ? styles.inputWithIcon : styles.inputWithoutIcon,
            props.multiline && styles.multilineInput, // Add specific style for multiline
            inputStyle, // Apply custom input style
          ]}
          placeholderTextColor="#94A3B8"
          {...props}
        />
        {rightElement && (
          <RightElementWrapper 
            style={styles.rightElementContainer} 
            onPress={onRightElementPress}
            activeOpacity={onRightElementPress ? 0.6 : 1}
          >
            {rightElement}
          </RightElementWrapper>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1', // Softer border
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Changed to white for a cleaner look
    minHeight: 48, // Ensure consistent height
  },
  multilineInputWrapper: {
    alignItems: 'flex-start', // Align icon to top for multiline
    paddingVertical: 8, // Add some padding for multiline wrapper
  },
  inputError: {
    borderColor: '#EF4444',
  },
  icon: {
    paddingLeft: 12,
    paddingRight: 8, // Add some space between icon and input text
    alignSelf: 'center', // Center icon vertically
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12, // Consistent vertical padding
  },
  inputWithIcon: {
    paddingLeft: 0, // Icon has paddingRight
    paddingRight: 12,
  },
  inputWithoutIcon: {
    paddingHorizontal: 12, // Standard horizontal padding if no icon
  },
  multilineInput: {
    minHeight: 80, // Default min height for multiline
    textAlignVertical: 'top', // Standard for multiline
    paddingTop: 0, // Adjust padding for multiline if icon is present
  },
  rightElementContainer: { // Renamed for clarity
    paddingHorizontal: 12, // Standard padding for the right element
    alignSelf: 'center', // Center right element vertically
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6, // Increased margin for error text
  },
}); 