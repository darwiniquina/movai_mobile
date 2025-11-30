import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const UserCardSkeleton: React.FC = () => {
  return (
    <View style={styles.userRow}>
      <SkeletonLoader width={50} height={50} borderRadius={25} />
      <View style={styles.userInfo}>
        <SkeletonLoader
          width={120}
          height={16}
          borderRadius={8}
          style={{ marginBottom: 6 }}
        />
        <SkeletonLoader
          width={80}
          height={14}
          borderRadius={6}
          style={{ marginBottom: 4 }}
        />
        <SkeletonLoader width={150} height={12} borderRadius={6} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#333",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
});

export default SkeletonLoader;
