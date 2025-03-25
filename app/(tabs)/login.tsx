import { StyleSheet, Text, Image, View, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import ReactNativeBiometrics from 'react-native-biometrics';
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const rnBiometrics = new ReactNativeBiometrics();
const socketUrl = 'ws://207.246.73.245:3077/universidad/qr';

const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
const payload = epochTimeSeconds + 'qr';

const validateBiometricId = async (biometricId: string): Promise<string> => {
  try {

    console.log(biometricId)
    const response = await fetch('https://uah-api-stand.onrender.com/login', {
      method: 'POST',
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        biometric_id: biometricId,
      }),
    });

    const json = await response.json();
    return json.access_token as string;
  } catch (error) {
    throw new Error('Something got wrong');
  }
};

export default function TabTwoScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [qrScanned, setQrScanned] = useState<BarcodeScanningResult>();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (!qrScanned) return;
    const data = qrScanned.data;
    setIsAuth(true);

    rnBiometrics
      .createSignature({
        promptMessage: 'Viva la Cafunga',
        payload: 'dasdad',
        cancelButtonText: 'Cancelar',
      })
      .then(async (resultObject) => {
        const { success, signature } = resultObject;
        if (!success || !signature) return;

        const token = await validateBiometricId(signature);

        if (token) {
          sendJsonMessage({
            event: 'AUTH',
            data: {
              uuid: data,
              token: token,
            },
          });
        }

        setIsAuth(false);
      })
      .catch(() => {
        setIsAuth(false);
      });
  }, [qrScanned]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#7F1D1D', dark: '#7F1D1D' }}
      headerImage={
        <Image
          source={require('@/assets/images/images.jpeg')}
          style={styles.reactLogo}
        />
      }
    >
      <View>
        <ThemedText style={{ textAlign: 'center' }} type="title">
          Iniciar Sessión
        </ThemedText>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={{ marginBottom: 24 }}>
          Escanea el QR Code en la pagina de la Humboldt para Iniciar Sessión
        </Text>
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={async (v) => {
            if (isAuth) return;
            setQrScanned(v);
          }}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity> */}
          </View>
        </CameraView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  camera: {
    flex: 1,
    aspectRatio: '1/1',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    padding: 20,
  },
  message: {},
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
