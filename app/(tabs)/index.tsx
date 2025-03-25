import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  Pressable,
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const createUserSchema = z.object({
  username: z.string().min(1, { message: 'Este campo es requerido' }),
  lastname: z.string().min(1, { message: 'Este campo es requerido' }),
  email: z.string().email({ message: 'Correo Inválido' }),
});

type CreateUserSchemaType = z.infer<typeof createUserSchema>;

const createUser = async (
  data: CreateUserSchemaType & { biometric_id: string },
) => {
 
  try {
    await fetch('https://uah-api-stand.onrender.com/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: data.username,
        apellido: data.lastname,
        admin: false,
        biometric_id: data.biometric_id,
      }),
    });

    Alert.alert('Éxito', 'Usuario agregado correctamente.');
  } catch (error) {
    Alert.alert('No se pudo crear el usuario');
  }
};

export default function HomeScreen() {
  const { control, handleSubmit } = useForm<CreateUserSchemaType>({
    defaultValues: {
      username: '',
      email: '',
      lastname: '',
    },
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit: SubmitHandler<CreateUserSchemaType> = (data) => {
    rnBiometrics
      .createSignature({
        promptMessage: 'Viva la Cafunga',
        payload: 'dasdad',
        cancelButtonText: 'Cancelar',
      })
      .then(async (resultObject) => {
        const { success, signature } = resultObject;
        if (!success || !signature) return;
        createUser({
          username: data.username,
          email: data.email,
          lastname: data.lastname,
          biometric_id: signature
        });
      });
  };

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
      <View style={{ marginBottom: 24 }}>
        <ThemedText style={{ textAlign: 'center' }} type="title">
          Registros UAH
        </ThemedText>
      </View>
      <View style={styles.stepContainer}>
        <View>
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.label, error && { color: 'red' }]}>
                  Nombre:
                </Text>
                <TextInput
                  style={[styles.input, error && { borderColor: 'red' }]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ingresa tu nombre"
                />
                {error?.message && (
                  <Text style={{ color: 'red' }}>{error.message}</Text>
                )}
              </>
            )}
          />
        </View>
        <View>
          <Controller
            name="lastname"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.label, error && { color: 'red' }]}>
                  Apellido
                </Text>
                <TextInput
                  style={[styles.input, error && { borderColor: 'red' }]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ingresa tu nombre"
                />
                {error?.message && (
                  <Text style={{ color: 'red' }}>{error.message}</Text>
                )}
              </>
            )}
          />
        </View>
        <View>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.label, error && { color: 'red' }]}>
                  Correo electrónico:
                </Text>
                <TextInput
                  style={[styles.input, error && { borderColor: 'red' }]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ingresa tu correo electrónico"
                  keyboardType="email-address"
                />
                {error?.message && (
                  <Text style={{ color: 'red' }}>{error.message}</Text>
                )}
              </>
            )}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Pressable
            style={{
              borderRadius: 12,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 10,
              height: 50,
              paddingBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#7F1D1D',
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
              }}
            >
              Registrarse
            </Text>
          </Pressable>
        </View>
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
    gap: 12,
    marginBottom: 8,
  },
  camera: {
    flex: 1,
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
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,

    paddingHorizontal: 10,
  },
});
