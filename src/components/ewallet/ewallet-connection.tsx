'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEWalletStore } from '@/store/ewallet-store';
import { useFinanceStore } from '@/store/finance-store';
import { formatVND } from '@/lib/utils';
import { EWalletConnection } from '@/types';
import { 
  Smartphone, 
  Wallet, 
  RotateCw, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Zap,
  RefreshCw,
  WifiOff
} from 'lucide-react';

interface EWalletConnectionProps {
  className?: string;
}

// Mock notification system since we don't have it yet
const useNotifications = () => ({
  addNotification: (notification: { type: string; title: string; message: string }) => {
    console.log(`${notification.type.toUpperCase()}: ${notification.title} - ${notification.message}`);
  }
});

// Format date helper
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString();
};

export default function EWalletConnectionComponent({ className }: EWalletConnectionProps) {
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { 
    connections, 
    isLoading, 
    syncResults, 
    connectMoMo, 
    syncWallet, 
    syncAllWallets, 
    disconnectWallet,
    getActiveConnections,
    getTotalSyncedTransactions
  } = useEWalletStore();

  const { addEWalletTransaction } = useFinanceStore();
  const { addNotification } = useNotifications();

  // Listen for e-wallet transaction imports
  useEffect(() => {
    const handleEWalletImport = (event: CustomEvent) => {
      const transaction = event.detail;
      addEWalletTransaction(transaction);
      
      addNotification({
        type: 'success',
        title: 'Transaction Imported',
        message: `${formatVND(transaction.amount)} ${transaction.type} from ${transaction.source?.toUpperCase()}`
      });
    };

    window.addEventListener('ewallet-transaction-import', handleEWalletImport as EventListener);
    return () => {
      window.removeEventListener('ewallet-transaction-import', handleEWalletImport as EventListener);
    };
  }, [addEWalletTransaction, addNotification]);

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      addNotification({
        type: 'error',
        title: 'Invalid Phone Number',
        message: 'Please enter a valid phone number'
      });
      return;
    }

    // Mock OTP sending
    setOtpSent(true);
    addNotification({
      type: 'info',
      title: 'OTP Sent',
      message: 'Please check your phone for the OTP code. Use "123456" for demo.'
    });
  };

  const handleConnect = async () => {
    if (!otp.trim()) {
      addNotification({
        type: 'error',
        title: 'Invalid OTP',
        message: 'Please enter the OTP code'
      });
      return;
    }

    const result = await connectMoMo(phoneNumber, otp);
    
    if (result.success) {
      addNotification({
        type: 'success',
        title: 'MoMo Connected',
        message: 'Your MoMo account has been connected successfully!'
      });
      setShowConnectForm(false);
      setPhoneNumber('');
      setOtp('');
      setOtpSent(false);
    } else {
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: result.error || 'Failed to connect MoMo account'
      });
    }
  };

  const handleSync = async (connectionId: string) => {
    const result = await syncWallet(connectionId);
    
    if (result.success) {
      addNotification({
        type: 'success',
        title: 'Sync Completed',
        message: `Imported ${result.transactionsImported} new transactions, skipped ${result.duplicatesSkipped} duplicates`
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Sync Failed',
        message: result.errors.join(', ') || 'Failed to sync transactions'
      });
    }
  };

  const handleSyncAll = async () => {
    await syncAllWallets();
    addNotification({
      type: 'success',
      title: 'All Wallets Synced',
      message: 'Completed syncing all connected e-wallets'
    });
  };

  const handleDisconnect = async (connectionId: string) => {
    const success = await disconnectWallet(connectionId);
    
    if (success) {
      addNotification({
        type: 'success',
        title: 'Wallet Disconnected',
        message: 'E-wallet has been disconnected successfully'
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Disconnect Failed',
        message: 'Failed to disconnect e-wallet'
      });
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'momo':
        return '💳';
      case 'zalopay':
        return '🔵';
      case 'viettelpay':
        return '🟡';
      default:
        return '💰';
    }
  };

  const getStatusBadge = (connection: EWalletConnection) => {
    if (!connection.isActive) {
      return <Badge variant="error">Disconnected</Badge>;
    }
    
    const lastSync = connection.lastSyncAt ? new Date(connection.lastSyncAt) : null;
    const isRecent = lastSync && (Date.now() - lastSync.getTime()) < 24 * 60 * 60 * 1000; // 24 hours
    
    return (
      <Badge variant={isRecent ? "success" : "default"}>
        {isRecent ? 'Synced' : 'Needs Sync'}
      </Badge>
    );
  };

  const activeConnections = getActiveConnections();
  const totalSynced = getTotalSyncedTransactions();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl gradient-text">E-Wallet Integration</CardTitle>
                <p className="text-sm text-gray-600">
                  Auto-sync transactions from your e-wallets
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{activeConnections.length}</div>
              <div className="text-sm text-gray-500">Connected</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{totalSynced}</div>
              <div className="text-sm text-gray-600">Total Synced</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {Object.values(syncResults).filter(r => r.success).length}
              </div>
              <div className="text-sm text-gray-600">Successful Syncs</div>
            </div>
            <div className="text-center">
              <Button
                onClick={handleSyncAll}
                disabled={isLoading || activeConnections.length === 0}
                variant="gradient"
                size="sm"
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCw className="h-4 w-4 mr-2" />
                )}
                Sync All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Wallets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Connected Wallets</h3>
          <Button
            onClick={() => setShowConnectForm(true)}
            size="sm"
            variant="gradient"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>

        {connections.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <WifiOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No wallets connected</h4>
              <p className="text-gray-600 mb-4">
                Connect your e-wallets to automatically sync transactions
              </p>
              <Button onClick={() => setShowConnectForm(true)} variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => {
              const syncResult = syncResults[connection.id];
              return (
                <Card key={connection.id} className="glass border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getProviderIcon(connection.provider)}</div>
                        <div>
                          <h4 className="font-medium">{connection.accountName}</h4>
                          <p className="text-sm text-gray-600">{connection.accountNumber}</p>
                        </div>
                      </div>
                      {getStatusBadge(connection)}
                    </div>

                    {connection.lastSyncAt && (
                      <div className="text-xs text-gray-500 mb-3">
                        Last sync: {formatDate(connection.lastSyncAt)}
                      </div>
                    )}

                    {syncResult && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Found:</span>
                          <span className="font-medium">{syncResult.transactionsFound}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Imported:</span>
                          <span className="font-medium text-green-600">{syncResult.transactionsImported}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Duplicates:</span>
                          <span className="font-medium text-yellow-600">{syncResult.duplicatesSkipped}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleSync(connection.id)}
                        disabled={isLoading || !connection.isActive}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RotateCw className="h-4 w-4 mr-2" />
                        )}
                        Sync
                      </Button>
                      <Button
                        onClick={() => handleDisconnect(connection.id)}
                        disabled={isLoading}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Connect Form Modal */}
      {showConnectForm && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Connect MoMo Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="0987654321"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={otpSent}
              />
            </div>

            {!otpSent ? (
              <Button 
                onClick={handleSendOTP} 
                disabled={isLoading}
                className="w-full"
                variant="gradient"
              >
                <Zap className="h-4 w-4 mr-2" />
                Send OTP
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP Code
                  </label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Demo: Use &quot;123456&quot; as OTP code
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleConnect} 
                    disabled={isLoading}
                    className="flex-1"
                    variant="gradient"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Connect
                  </Button>
                  <Button 
                    onClick={() => setOtpSent(false)}
                    variant="outline"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}

            <Button 
              onClick={() => {
                setShowConnectForm(false);
                setPhoneNumber('');
                setOtp('');
                setOtpSent(false);
              }}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
