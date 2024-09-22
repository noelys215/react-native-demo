import React from 'react';
import AppGradient from '@/components/AppGradient';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AFFIRMATION_GALLERY from '@/constants/affirmation-gallary';
import GuidedAffirmationsGallery from '@/components/GuidedAffirmationsGallery';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Affirmations = () => {
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1">
			<LinearGradient
				// Background Linear Gradient
				colors={['#2e1f58', '#54426b', '#a790af']}
				className="px-5"
				style={{ paddingTop: insets.top }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text className="text-zinc-50 text-3xl font-bold">
						Change your beliefs with affirmations
					</Text>
					<View>
						{AFFIRMATION_GALLERY.map((g) => (
							<GuidedAffirmationsGallery
								key={g.title}
								title={g.title}
								products={g.data}
							/>
						))}
					</View>
				</ScrollView>
			</LinearGradient>
			<StatusBar style="light" />
		</View>
	);
};

export default Affirmations;
