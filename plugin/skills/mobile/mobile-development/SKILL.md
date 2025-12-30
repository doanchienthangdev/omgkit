---
name: mobile-development
description: Cross-platform mobile development with React Native and Expo including navigation, state management, and native features
category: mobile
triggers:
  - mobile development
  - react native
  - expo
  - cross platform
  - mobile app
  - ios android
  - native features
---

# Mobile Development

Build **cross-platform mobile applications** with React Native and Expo. This skill covers component architecture, navigation patterns, state management, and native feature integration.

## Purpose

Create production-ready mobile applications:

- Build iOS and Android apps from single codebase
- Implement native navigation patterns
- Manage application state effectively
- Access device features (camera, location, notifications)
- Handle offline-first architecture
- Optimize performance for mobile devices

## Features

### 1. Expo Project Setup

```bash
# Create new Expo project
npx create-expo-app@latest my-app --template tabs

# Project structure
my-app/
├── app/                    # File-based routing
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── index.tsx      # Home tab
│   │   └── profile.tsx    # Profile tab
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screen
├── components/            # Reusable components
├── hooks/                 # Custom hooks
├── services/              # API services
├── store/                 # State management
├── constants/             # App constants
└── assets/                # Images, fonts
```

```typescript
// app/_layout.tsx - Root layout with providers
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

### 2. Navigation Patterns

```typescript
// Tab Navigation with Expo Router
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

// Stack Navigation with authentication
// app/(auth)/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

// Deep linking configuration
// app.json
{
  "expo": {
    "scheme": "myapp",
    "web": {
      "bundler": "metro"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://myapp.com"
        }
      ]
    ]
  }
}
```

### 3. State Management with Zustand

```typescript
// store/useStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Cart store with computed values
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.productId === item.productId);
    if (existing) {
      return {
        items: state.items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      };
    }
    return {
      items: [...state.items, { ...item, id: generateId() }],
    };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity > 0
      ? state.items.map(i => i.id === id ? { ...i, quantity } : i)
      : state.items.filter(i => i.id !== id),
  })),

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  itemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));
```

### 4. API Integration with React Query

```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/useStore';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const params = categoryId ? { category: categoryId } : {};
      const { data } = await api.get('/products', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderInput) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Infinite scroll with pagination
export function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/products', {
        params: { page: pageParam, limit: 20 },
      });
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
```

### 5. Native Features

```typescript
// Camera integration
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      // Handle photo
      await uploadImage(photo.uri);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setType(
            type === CameraType.back ? CameraType.front : CameraType.back
          )}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="images" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

// Location services
import * as Location from 'expo-location';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    })();
  }, []);

  return { location, error };
}

// Push notifications
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  });

  return token.data;
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotifications().then(setExpoPushToken);

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        // Handle notification tap
        if (data.screen) {
          router.push(data.screen);
        }
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken };
}
```

### 6. Performance Optimization

```typescript
// Optimized FlatList with virtualization
import { FlashList } from '@shopify/flash-list';

interface ProductListProps {
  products: Product[];
  onEndReached: () => void;
}

export function ProductList({ products, onEndReached }: ProductListProps) {
  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} />
  ), []);

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <FlashList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={200}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={EmptyState}
    />
  );
}

// Memoized components
const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate('ProductDetail', { id: product.id });
  }, [product.id, navigation]);

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </Pressable>
  );
});

// Image optimization with expo-image
import { Image } from 'expo-image';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7telephones';

export function OptimizedImage({ source, style }) {
  return (
    <Image
      source={source}
      style={style}
      placeholder={blurhash}
      contentFit="cover"
      transition={300}
      cachePolicy="memory-disk"
    />
  );
}

// Skeleton loading
import { Skeleton } from 'moti/skeleton';

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton colorMode="light" width="100%" height={200} />
      <Skeleton colorMode="light" width="80%" height={20} />
      <Skeleton colorMode="light" width="40%" height={16} />
    </View>
  );
}
```

## Use Cases

### 1. E-commerce App

```typescript
// Complete product screen
export function ProductScreen() {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading } = useProduct(id as string);
  const addToCart = useCartStore((state) => state.addItem);

  if (isLoading) return <ProductSkeleton />;
  if (!product) return <NotFound />;

  return (
    <ScrollView>
      <ImageGallery images={product.images} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <VariantSelector
          variants={product.variants}
          onSelect={setSelectedVariant}
        />

        <Button
          title="Add to Cart"
          onPress={() => addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          })}
        />

        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}
```

### 2. Social App with Real-time

```typescript
// Real-time chat with Socket.io
import { io } from 'socket.io-client';

export function useChatRoom(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const token = useAuthStore.getState().token;

    socketRef.current = io(process.env.EXPO_PUBLIC_WS_URL!, {
      auth: { token },
    });

    socketRef.current.emit('join', roomId);

    socketRef.current.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current?.emit('leave', roomId);
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const sendMessage = useCallback((content: string) => {
    socketRef.current?.emit('message', { roomId, content });
  }, [roomId]);

  return { messages, sendMessage };
}
```

## Best Practices

### Do's

- **Use Expo for faster development** - Managed workflow handles complexity
- **Implement offline-first** - Use AsyncStorage and optimistic updates
- **Optimize images** - Use expo-image with caching
- **Use FlashList** - Better performance than FlatList
- **Test on real devices** - Simulators don't show real performance
- **Handle all permission states** - Request gracefully

### Don'ts

- Don't block the JS thread with heavy computations
- Don't use inline styles in render methods
- Don't forget to handle keyboard avoiding
- Don't ignore deep linking setup
- Don't skip splash screen configuration
- Don't neglect accessibility

### Performance Checklist

```markdown
## Mobile Performance Checklist

### Rendering
- [ ] Use memo for expensive components
- [ ] Implement proper list virtualization
- [ ] Optimize images (size, format, caching)
- [ ] Avoid inline function props

### State
- [ ] Split stores by domain
- [ ] Use selectors for derived state
- [ ] Persist critical data
- [ ] Handle loading/error states

### Network
- [ ] Implement request caching
- [ ] Use optimistic updates
- [ ] Handle offline gracefully
- [ ] Implement retry logic
```

## Related Skills

- **react** - React fundamentals
- **typescript** - Type-safe development
- **frontend-design** - UI/UX patterns
- **api-architecture** - Backend integration

## Reference Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
