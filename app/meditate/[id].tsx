import { View, Text, ImageBackground, Pressable } from 'react-native';
import React, { useContext, useEffect } from 'react';
import MEDITATION_IMAGES from '@/constants/meditation-images';
import AppGradient from '@/components/AppGradient';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import CustomButton from '@/components/CustomButton';
import { MEDITATION_DATA, AUDIO_FILES } from '@/constants/MeditationData';
import { TimerContext } from '@/context/TimerContext';

const Meditate = () => {
	const { id } = useLocalSearchParams();
	const { duration: secondsRemaining, setDuration } = useContext(TimerContext);
	const [isMeditating, setIsMeditating] = React.useState(false);
	const [audioSound, setAudioSound] = React.useState<Audio.Sound>();
	const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		// Exit early when we reach 0
		if (secondsRemaining === 0) {
			if (isPlayingAudio) audioSound?.pauseAsync();
			setIsMeditating(false);
			setIsPlayingAudio(false);
			return;
		}

		if (isMeditating) {
			// Save the interval ID to clear it when the component unmounts
			timerId = setTimeout(() => {
				setDuration(secondsRemaining - 1);
			}, 1000);
		}

		// Clear timeout if the component is unmounted or the time left changes
		return () => {
			clearTimeout(timerId);
		};
	}, [secondsRemaining, isMeditating]);

	useEffect(() => {
		return () => {
			setDuration(10);
			audioSound?.unloadAsync();
		};
	}, [audioSound]);

	const toggleMeditationSessionStatus = async () => {
		if (secondsRemaining === 0) setDuration(10);
		setIsMeditating(!isMeditating);
		await toggleSound();
	};

	const toggleSound = async () => {
		const sound = audioSound ? audioSound : await initializeSound();
		const status = await sound.getStatusAsync();

		if (status?.isLoaded && !isPlayingAudio) {
			await sound.playAsync();
			setIsPlayingAudio(true);
		} else {
			await sound.pauseAsync();
			setIsPlayingAudio(false);
		}
	};

	const initializeSound = async () => {
		const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;
		const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName]);
		setAudioSound(sound);
		return sound;
	};

	const handleAdjustDuration = () => {
		if (isMeditating) toggleMeditationSessionStatus();

		router.push('/(modal)/adjust-meditation-duration');
	};

	// Format the time
	const formattedTimeMinutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
	const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, '0');

	return (
		<View className="flex-1">
			<ImageBackground
				source={MEDITATION_IMAGES[Number(id) - 1]}
				resizeMode="cover"
				className="flex-1">
				<AppGradient colors={['transparent', 'rgba(0,0,0,0.8)']}>
					<Pressable
						onPress={() => router.back()}
						className="absolute top-16 left-6 z-10">
						<AntDesign name="leftcircleo" size={50} color="white" />
					</Pressable>

					<View className="flex-1 justify-center">
						<View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center">
							<Text className="text-4xl text-blue-800 font-rmono">
								{formattedTimeMinutes}:{formattedTimeSeconds}
							</Text>
						</View>
					</View>

					<View className="mb-5 ">
						<CustomButton title="Adjust Duration" onPress={handleAdjustDuration} />
						<CustomButton
							containerStyles="mt-4"
							title={isMeditating ? 'Pause' : 'Start'}
							onPress={toggleMeditationSessionStatus}
						/>
					</View>
				</AppGradient>
			</ImageBackground>
		</View>
	);
};

export default Meditate;
