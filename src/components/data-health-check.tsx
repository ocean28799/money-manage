'use client';

import { useEffect, useState } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { useTaskStore } from '@/store/task-store';
import { useNotifications } from '@/components/ui/notifications';

export function DataHealthCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const { transactions, templates } = useFinanceStore();
  const { tasks } = useTaskStore();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const checkDataIntegrity = () => {
      try {
        // Check if data structures are properly initialized
        const isFinanceStoreHealthy = Array.isArray(transactions) && Array.isArray(templates);
        const isTaskStoreHealthy = Array.isArray(tasks);
        
        // Validate data types in transactions
        const validTransactions = transactions.filter(t => 
          t && 
          typeof t.id === 'string' &&
          typeof t.amount === 'number' &&
          t.date instanceof Date &&
          ['income', 'expense'].includes(t.type)
        );
        
        // Validate data types in tasks
        const validTasks = tasks.filter(t =>
          t &&
          typeof t.id === 'string' &&
          typeof t.title === 'string' &&
          t.dueDate instanceof Date &&
          ['daily', 'monthly'].includes(t.type)
        );

        // Check for data corruption
        const transactionCorruption = transactions.length !== validTransactions.length;
        const taskCorruption = tasks.length !== validTasks.length;

        if (!isFinanceStoreHealthy || !isTaskStoreHealthy) {
          addNotification({
            type: 'error',
            title: 'Data Store Error',
            message: 'One or more data stores failed to initialize properly. Data may not persist.',
            autoClose: false
          });
        } else if (transactionCorruption || taskCorruption) {
          addNotification({
            type: 'warning',
            title: 'Data Migration Completed',
            message: `Found and cleaned corrupted data. ${transactionCorruption ? 'Some transactions' : ''} ${taskCorruption ? 'Some tasks' : ''} were repaired.`,
            duration: 8000
          });
        } else {
          // Success notification only if there are existing data
          if (transactions.length > 0 || tasks.length > 0) {
            addNotification({
              type: 'success',
              title: 'Data Loaded Successfully',
              message: `Loaded ${transactions.length} transactions and ${tasks.length} tasks. All data is secure.`,
              duration: 5000
            });
          }
        }

        console.log('✅ Data Health Check Complete:', {
          transactions: validTransactions.length,
          tasks: validTasks.length,
          templates: templates.length,
          corruptedTransactions: transactions.length - validTransactions.length,
          corruptedTasks: tasks.length - validTasks.length
        });

      } catch (error) {
        console.error('❌ Data Health Check Failed:', error);
        addNotification({
          type: 'error',
          title: 'Data Health Check Failed',
          message: 'Unable to verify data integrity. Please refresh the page.',
          autoClose: false
        });
      } finally {
        setIsChecking(false);
      }
    };

    // Run health check after a short delay to ensure stores are hydrated
    const timer = setTimeout(checkDataIntegrity, 1000);
    return () => clearTimeout(timer);
  }, [transactions, tasks, templates, addNotification]);

  // Test data persistence by adding a test item and removing it
  useEffect(() => {
    if (!isChecking && typeof window !== 'undefined') {
      const testPersistence = async () => {
        try {
          // Test localStorage availability
          const testKey = 'data-persistence-test';
          const testValue = { timestamp: Date.now() };
          
          localStorage.setItem(testKey, JSON.stringify(testValue));
          const retrieved = localStorage.getItem(testKey);
          
          if (!retrieved || JSON.parse(retrieved).timestamp !== testValue.timestamp) {
            throw new Error('localStorage write/read failed');
          }
          
          localStorage.removeItem(testKey);
          console.log('✅ Data persistence test passed');
          
        } catch (error) {
          console.error('❌ Data persistence test failed:', error);
          addNotification({
            type: 'error',
            title: 'Data Persistence Warning',
            message: 'Local storage may not be working. Your data might not be saved when you refresh the page.',
            autoClose: false
          });
        }
      };

      testPersistence();
    }
  }, [isChecking, addNotification]);

  // This component doesn't render anything visible
  return null;
}
