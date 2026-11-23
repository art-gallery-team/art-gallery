import { supabase } from './supabaseClient';

export function subscribeToAuctionUpdates(onUpdate: () => void): () => void {
  const channelName = `auction-live-updates-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lots' }, () => {
      onUpdate();
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, () => {
      onUpdate();
    })
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
