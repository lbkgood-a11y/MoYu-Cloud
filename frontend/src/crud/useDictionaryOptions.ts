import { onMounted, ref } from 'vue';
import { fetchDictionary } from '../api/dictionary';

export function useDictionaryOptions(code: string) {
  const options = ref<{ label: string; value: string }[]>([]);
  const loading = ref(false);
  const error = ref(false);
  async function load() {
    loading.value = true; error.value = false;
    try { const items = (await fetchDictionary(code)).data.data.items || []; options.value = items.filter((i: any) => i.enabled).map((i: any) => ({ label: i.itemLabel, value: i.itemValue })); }
    catch { error.value = true; }
    finally { loading.value = false; }
  }
  onMounted(load);
  return { options, loading, error, reload: load };
}
