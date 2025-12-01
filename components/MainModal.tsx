import {
    Modal,
    TouchableOpacity,
    View
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { ReactNode } from 'react';

const MainModal = ({
    modalVisible = false,
    setModalVisible,
    children,
}: {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    children?: ReactNode;
}) =>
{
    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
            animationType='fade'
        >
            <BlurView
                intensity={100}
                tint='systemUltraThinMaterialDark'
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={{
                    width: '90%',
                    minHeight: '70%',
                    padding: 20,
                    backgroundColor: '#000000',
                    position: 'relative'
                }}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        activeOpacity={0.8}
                        style={{
                            position: 'absolute',
                            top: 8.5,
                            right: 0,
                            width: 30,
                            height: 30
                        }}
                    >
                        <Image
                            source={require('@/assets/images/x-icon.png')}
                            style={{
                                width: 16,
                                height: 16
                            }}
                        />
                    </TouchableOpacity>

                    {children}
                </View>
            </BlurView>
        </Modal>
    )
};

export default MainModal;