import { motion } from 'framer-motion';
import { UserManagement } from '@/components/admin/UserManagement';

export function AdminUsers() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
      </div>

      <UserManagement />
    </motion.div>
  );
}