// ============================================================================
// DEMO PAGE
// Demonstrates: stepper, modal, EventBus, WXS filters, Behavior, lifecycle
// ============================================================================

import { createPageHelpers, showToast } from '../../utils/helpers/page';
import { loadingBehavior } from '../../utils/behaviors/loading';

const app = getApp();
const { STATE_KEYS } = app.globalData;

Page({
  behaviors: [loadingBehavior],

  data: {
    // Stepper state
    steps: ['Details', 'Review', 'Confirm'],
    currentStep: 0,

    // Modal state
    showBottomSheet: false,

    // Loading state (from EventBus via helpers)
    userName: '',

    // Button loading demo
    isSubmitting: false,

    // WXS demo data
    sampleDate: '2024-12-15T10:30:00Z',
    samplePrice: 2500,
    sampleText: 'This is a long text string that should be truncated by the WXS filter for display',
    sampleStatus: 'active',

    // Behavior demo data
    behaviorResult: '',
  },

  /**
   * Page initialization
   */
  async onLoad() {
    await app.globalData.initPromise;

    // Setup EventBus helpers for automatic state sync
    this._helpers = createPageHelpers(this, {
      userName: STATE_KEYS.USER_NAME,
    });
    this._helpers.subscribe();
    this._helpers.loadInitial();
  },

  /**
   * Cleanup on page unload
   */
  onUnload() {
    if (this._helpers) {
      this._helpers.unsubscribe();
    }
  },

  // ==========================================================================
  // STEPPER HANDLERS
  // ==========================================================================

  handleStepChange(e) {
    const { index } = e.detail;
    this.setData({ currentStep: index });
  },

  handleNextStep() {
    const { currentStep, steps } = this.data;
    if (currentStep < steps.length - 1) {
      this.setData({ currentStep: currentStep + 1 });
    }
  },

  handlePrevStep() {
    const { currentStep } = this.data;
    if (currentStep > 0) {
      this.setData({ currentStep: currentStep - 1 });
    }
  },

  // ==========================================================================
  // MODAL HANDLERS
  // ==========================================================================

  handleOpenBottomSheet() {
    this.setData({ showBottomSheet: true });
  },

  handleCloseBottomSheet() {
    this.setData({ showBottomSheet: false });
  },

  // ==========================================================================
  // BUTTON DEMO HANDLERS
  // ==========================================================================

  handleSubmit() {
    this.setData({ isSubmitting: true });

    // Simulate async operation
    setTimeout(() => {
      this.setData({ isSubmitting: false });
      showToast('Action completed', 'success');
    }, 2000);
  },

  // ==========================================================================
  // BEHAVIOR DEMO HANDLERS
  // ==========================================================================

  /**
   * Demonstrates the loadingBehavior's withLoading() method.
   * Automatically manages isLoading/hasError/errorMessage state.
   */
  handleBehaviorDemo() {
    this.withLoading(async () => {
      // Simulate an async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.setData({ behaviorResult: 'Data loaded successfully via Behavior!' });
    }, { loadingText: 'Loading...' });
  },

  /**
   * Demonstrates the loadingBehavior's error handling.
   */
  handleBehaviorError() {
    this.withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error('Simulated error from Behavior demo');
    });
  },
});
