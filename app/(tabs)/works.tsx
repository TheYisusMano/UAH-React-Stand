import { StyleSheet, Text, Image, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';

export default function Page() {
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
        <ThemedText
          style={{ textAlign: 'center', marginBottom: 24 }}
          type="title"
        >
          ¿Cómo funciona?
        </ThemedText>
      </View>
      <View
        style={{
          flex: 1,
          gap: 10,
        }}
      >
        <Text style={styles.text}>
          La aplicación de Registros en la UAH implementa un sistema de
          comunicación en tiempo real utilizando WebSockets. Este protocolo
          permite un proceso de autenticación fluido y seguro entre la
          plataforma web y la aplicación Android.
        </Text>

        <Text style={styles.heading}>¿Qué son los WebSockets?</Text>

        <Text style={styles.text}>
          Los WebSockets son un protocolo de comunicación bidireccional basado
          en TCP, el mismo protocolo subyacente utilizado por HTTP. Sin embargo,
          a diferencia de HTTP, los WebSockets establecen una conexión
          persistente y full-duplex entre el cliente y el servidor. Esto permite
          que ambos dispositivos puedan intercambiar datos de manera simultánea
          mientras la conexión permanezca abierta.
        </Text>

        <Text style={styles.text}>
          Este protocolo es ideal para aplicaciones que requieren
          funcionalidades en tiempo real, como sistemas de mensajería
          instantánea, juegos multijugador, gráficos de datos en vivo, y, en
          este caso, autenticación en tiempo real.
        </Text>

        <Text style={styles.heading}>Flujo de la aplicación</Text>

        <Text style={styles.text}>
          1. Cuando un usuario se registra en la aplicación, se almacena un
          identificador único generado a partir de su huella digital en la base
          de datos, junto con sus datos personales: nombre, apellido y correo
          electrónico.
        </Text>

        <Text style={styles.text}>
          2. Una vez registrado, el usuario puede escanear un código QR desde la
          plataforma web. Este proceso establece una conexión entre la web, el
          servidor de WebSockets y el dispositivo móvil que escaneó el código.
        </Text>

        <Text style={styles.text}>
          3. El usuario autentica su identidad utilizando su huella digital. El
          identificador único asociado a su huella se envía al servidor, el cual
          verifica si existe un usuario registrado con dicho identificador. Si
          la verificación es exitosa, el servidor genera y devuelve un token de
          acceso.
        </Text>

        <Text style={styles.text}>
          4. La aplicación recibe el token de acceso y lo envía al servidor de
          WebSockets. Finalmente, el servidor transmite el token a la plataforma
          web, permitiendo que el usuario acceda de manera segura a la
          plataforma.
        </Text>
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
  text: {
    fontSize: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
