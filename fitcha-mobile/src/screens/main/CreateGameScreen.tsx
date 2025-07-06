import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type CreateGameScreenNavigationProp = StackNavigationProp<MainStackParamList>;

// Activity types with rich metadata
const ACTIVITY_TYPES = {
  sports: {
    label: 'Sports & Athletics',
    icon: 'basketball-outline',
    color: '#3B82F6',
    activities: [
      'Basketball', 'Football', 'Soccer', 'Tennis', 'Volleyball', 'Baseball',
      'Swimming', 'Running', 'Cycling', 'Golf', 'Boxing', 'Wrestling',
    ],
  },
  wellness: {
    label: 'Wellness & Fitness',
    icon: 'heart-outline',
    color: '#10B981',
    activities: [
      'Yoga', 'Pilates', 'Meditation', 'Gym Workout', 'CrossFit', 'Zumba',
      'Personal Training', 'Stretching', 'Cardio', 'Weight Training',
    ],
  },
  gaming: {
    label: 'Gaming & Esports',
    icon: 'game-controller-outline',
    color: '#8B5CF6',
    activities: [
      'Video Games', 'Board Games', 'Card Games', 'Chess', 'Poker',
      'Esports Tournament', 'LAN Party', 'Mobile Gaming',
    ],
  },
  mental: {
    label: 'Mental & Brain',
    icon: 'brain-outline',
    color: '#6366F1',
    activities: [
      'Study Group', 'Book Club', 'Trivia Night', 'Puzzle Solving',
      'Language Exchange', 'Debate Club', 'Quiz Competition',
    ],
  },
  creative: {
    label: 'Creative & Arts',
    icon: 'color-palette-outline',
    color: '#EC4899',
    activities: [
      'Music Jam', 'Art Workshop', 'Photography Walk', 'Writing Circle',
      'Dance Class', 'Theater', 'Crafting', 'Painting',
    ],
  },
  social: {
    label: 'Social & Networking',
    icon: 'people-outline',
    color: '#F59E0B',
    activities: [
      'Coffee Meetup', 'Networking Event', 'Dinner Party', 'Picnic',
      'Happy Hour', 'Group Travel', 'Workshop', 'Conference',
    ],
  },
};

// Skill Levels
const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to this activity' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Very experienced' },
  { value: 'professional', label: 'Professional', description: 'Expert level' },
];

interface GameFormData {
  category: string;
  activity: string;
  title: string;
  description: string;
  date: Date;
  time: Date;
  duration: number;
  location: string;
  maxParticipants: number;
  skillLevel: string;
  cost: number;
  costType: 'free' | 'paid' | 'split';
  equipment: string;
  notes: string;
  isPrivate: boolean;
  inviteOnly: boolean;
  recurring: boolean;
  recurringPattern: string;
}

const CreateGameScreen: React.FC = () => {
  const navigation = useNavigation<CreateGameScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GameFormData>({
    category: '',
    activity: '',
    title: '',
    description: '',
    date: new Date(),
    time: new Date(),
    duration: 1,
    location: '',
    maxParticipants: 4,
    skillLevel: 'intermediate',
    cost: 0,
    costType: 'free',
    equipment: '',
    notes: '',
    isPrivate: false,
    inviteOnly: false,
    recurring: false,
    recurringPattern: 'weekly',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCreateGame = async () => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCreating(false);
    
    // Show success message
    Alert.alert(
      'Success!',
      'Your game has been created successfully.',
      [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs') }
      ]
    );
  };

  const renderCategorySelection = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        What do you want to play?
      </Text>
      <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
        Choose your activity category and specific game
      </Text>
      
      <View style={styles.categoriesGrid}>
        {Object.entries(ACTIVITY_TYPES).map(([key, type]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryCard,
              { backgroundColor: theme.card },
              formData.category === key && { borderColor: type.color, borderWidth: 2 }
            ]}
            onPress={() => setFormData(prev => ({ ...prev, category: key, activity: '' }))}
          >
            <View style={[styles.categoryIcon, { backgroundColor: type.color + '20' }]}>
              <Ionicons name={type.icon as any} size={24} color={type.color} />
            </View>
            <Text style={[styles.categoryLabel, { color: theme.text }]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {formData.category && (
        <View style={styles.activitiesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Specific Activity
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activitiesList}
          >
            {ACTIVITY_TYPES[formData.category as keyof typeof ACTIVITY_TYPES].activities.map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[
                  styles.activityButton,
                  { backgroundColor: theme.card },
                  formData.activity === activity && { 
                    backgroundColor: ACTIVITY_TYPES[formData.category as keyof typeof ACTIVITY_TYPES].color + '20',
                    borderColor: ACTIVITY_TYPES[formData.category as keyof typeof ACTIVITY_TYPES].color,
                    borderWidth: 1,
                  }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, activity }))}
              >
                <Text 
                  style={[
                    styles.activityButtonText, 
                    { color: formData.activity === activity 
                      ? ACTIVITY_TYPES[formData.category as keyof typeof ACTIVITY_TYPES].color 
                      : theme.text 
                    }
                  ]}
                >
                  {activity}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderGameDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Game Details
      </Text>
      <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
        Tell us about your {formData.activity} activity
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Game Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Enter game title"
          placeholderTextColor={theme.placeholder}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Description</Text>
        <TextInput
          style={[
            styles.input, 
            styles.textArea, 
            { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }
          ]}
          placeholder="Describe your game, rules, what to bring, etc."
          placeholderTextColor={theme.placeholder}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Date</Text>
          <TouchableOpacity
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: theme.text }}>
              {formData.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData(prev => ({ ...prev, date: selectedDate }));
                }
              }}
            />
          )}
        </View>
        
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Time</Text>
          <TouchableOpacity
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={{ color: theme.text }}>
              {formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={formData.time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setFormData(prev => ({ ...prev, time: selectedTime }));
                }
              }}
            />
          )}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Duration (hours)</Text>
        <View style={styles.durationContainer}>
          {[1, 2, 3, 4].map((hours) => (
            <TouchableOpacity
              key={hours}
              style={[
                styles.durationButton,
                { backgroundColor: theme.card },
                formData.duration === hours && { backgroundColor: theme.primary }
              ]}
              onPress={() => setFormData(prev => ({ ...prev, duration: hours }))}
            >
              <Text 
                style={[
                  styles.durationButtonText, 
                  { color: formData.duration === hours ? 'white' : theme.text }
                ]}
              >
                {hours} {hours === 1 ? 'hour' : 'hours'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderLocationAndPlayers = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Location & Players
      </Text>
      <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
        Where will you play and how many players?
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Enter venue name or address"
          placeholderTextColor={theme.placeholder}
          value={formData.location}
          onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Maximum Participants</Text>
        <View style={styles.participantsContainer}>
          <TouchableOpacity
            style={[styles.participantButton, { backgroundColor: theme.card }]}
            onPress={() => setFormData(prev => ({ ...prev, maxParticipants: Math.max(2, prev.maxParticipants - 1) }))}
          >
            <Ionicons name="remove" size={24} color={theme.text} />
          </TouchableOpacity>
          
          <View style={[styles.participantCount, { backgroundColor: theme.card }]}>
            <Text style={[styles.participantCountText, { color: theme.text }]}>
              {formData.maxParticipants}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.participantButton, { backgroundColor: theme.card }]}
            onPress={() => setFormData(prev => ({ ...prev, maxParticipants: Math.min(50, prev.maxParticipants + 1) }))}
          >
            <Ionicons name="add" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Skill Level</Text>
        <View style={styles.skillLevelsContainer}>
          {SKILL_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.skillLevelButton,
                { backgroundColor: theme.card },
                formData.skillLevel === level.value && { backgroundColor: theme.primary }
              ]}
              onPress={() => setFormData(prev => ({ ...prev, skillLevel: level.value }))}
            >
              <Text 
                style={[
                  styles.skillLevelButtonText, 
                  { color: formData.skillLevel === level.value ? 'white' : theme.text }
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Equipment Needed</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="e.g., Bring your own racket, balls provided"
          placeholderTextColor={theme.placeholder}
          value={formData.equipment}
          onChangeText={(text) => setFormData(prev => ({ ...prev, equipment: text }))}
        />
      </View>
    </View>
  );

  const renderCostAndPrivacy = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Cost & Privacy
      </Text>
      <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
        Set the cost for your game and privacy settings
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Cost Type</Text>
        <View style={styles.costTypeContainer}>
          {[
            { value: 'free', label: 'Free', icon: 'checkmark-circle-outline' },
            { value: 'split', label: 'Split Cost', icon: 'people-outline' },
            { value: 'paid', label: 'Paid Entry', icon: 'cash-outline' },
          ].map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.costTypeButton,
                { backgroundColor: theme.card },
                formData.costType === type.value && { 
                  borderColor: theme.primary,
                  borderWidth: 2,
                }
              ]}
              onPress={() => setFormData(prev => ({ ...prev, costType: type.value as 'free' | 'paid' | 'split' }))}
            >
              <Ionicons 
                name={type.icon as any} 
                size={24} 
                color={formData.costType === type.value ? theme.primary : theme.text} 
              />
              <Text 
                style={[
                  styles.costTypeText, 
                  { color: formData.costType === type.value ? theme.primary : theme.text }
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {formData.costType !== 'free' && (
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            {formData.costType === 'paid' ? 'Entry Fee ($)' : 'Total Cost to Split ($)'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="0.00"
            placeholderTextColor={theme.placeholder}
            value={formData.cost.toString()}
            onChangeText={(text) => {
              const numValue = parseFloat(text) || 0;
              setFormData(prev => ({ ...prev, cost: numValue }));
            }}
            keyboardType="numeric"
          />
          {formData.costType === 'split' && formData.maxParticipants > 0 && (
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Each player pays: ${(formData.cost / formData.maxParticipants).toFixed(2)}
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Privacy Settings</Text>
        
        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={[styles.switchLabel, { color: theme.text }]}>Private Game</Text>
              <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                Only visible to you and invited players
              </Text>
            </View>
            <Switch
              value={formData.isPrivate}
              onValueChange={(value) => setFormData(prev => ({ ...prev, isPrivate: value }))}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={formData.isPrivate ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={[styles.switchLabel, { color: theme.text }]}>Invite Only</Text>
              <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                Players must be invited to join
              </Text>
            </View>
            <Switch
              value={formData.inviteOnly}
              onValueChange={(value) => setFormData(prev => ({ ...prev, inviteOnly: value }))}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={formData.inviteOnly ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={[styles.switchLabel, { color: theme.text }]}>Recurring Game</Text>
              <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                Repeat this game on a schedule
              </Text>
            </View>
            <Switch
              value={formData.recurring}
              onValueChange={(value) => setFormData(prev => ({ ...prev, recurring: value }))}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={formData.recurring ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Additional Notes</Text>
        <TextInput
          style={[
            styles.input, 
            styles.textArea, 
            { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }
          ]}
          placeholder="Any additional information, rules, or requirements..."
          placeholderTextColor={theme.placeholder}
          value={formData.notes}
          onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create New Game</Text>
        </View>
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.progressStep}>
              <View 
                style={[
                  styles.progressDot,
                  { 
                    backgroundColor: currentStep >= step ? theme.primary : theme.border,
                    borderColor: currentStep === step ? theme.primary : 'transparent',
                  }
                ]}
              >
                {currentStep > step ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Text style={{ color: currentStep === step ? theme.primary : 'white' }}>
                    {step}
                  </Text>
                )}
              </View>
              {step < 4 && (
                <View 
                  style={[
                    styles.progressLine, 
                    { backgroundColor: currentStep > step ? theme.primary : theme.border }
                  ]} 
                />
              )}
            </View>
          ))}
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 1 && renderCategorySelection()}
          {currentStep === 2 && renderGameDetails()}
          {currentStep === 3 && renderLocationAndPlayers()}
          {currentStep === 4 && renderCostAndPrivacy()}
        </ScrollView>
        
        {/* Navigation Buttons */}
        <View style={[styles.buttonsContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.card }]}
              onPress={handlePrevious}
            >
              <Text style={[styles.backButtonText, { color: theme.text }]}>Back</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 4 ? (
            <TouchableOpacity
              style={[
                styles.nextButton, 
                { backgroundColor: theme.primary },
                currentStep === 1 && !formData.activity && { opacity: 0.5 },
              ]}
              onPress={handleNext}
              disabled={currentStep === 1 && !formData.activity}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.primary }]}
              onPress={handleCreateGame}
              disabled={isCreating}
            >
              {isCreating ? (
                <Text style={styles.createButtonText}>Creating...</Text>
              ) : (
                <Text style={styles.createButtonText}>Create Game</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  progressStep: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
  progressLine: {
    flex: 1,
    height: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  activitiesContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  activitiesList: {
    paddingBottom: 8,
  },
  activityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  formRow: {
    flexDirection: 'row',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantCount: {
    width: 80,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  participantCountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillLevelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillLevelButton: {
    width: '48%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  skillLevelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  costTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costTypeButton: {
    width: '31%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  costTypeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  backButton: {
    width: '48%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    width: currentStep > 1 ? '48%' : '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  createButton: {
    width: currentStep > 1 ? '48%' : '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default CreateGameScreen;