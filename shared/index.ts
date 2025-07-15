import type { useAddonHitokoto } from 'valaxy-addon-hitokoto'
import { ref } from 'vue'

export const addonHitokoto = ref<ReturnType<typeof useAddonHitokoto>>()
