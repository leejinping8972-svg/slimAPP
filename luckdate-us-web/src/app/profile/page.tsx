'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Check, Loader2, X, Camera } from 'lucide-react';
import { updateProfileApi, getUserInfo } from '@/lib/api/auth';
import { uploadImage } from '@/lib/api/upload';
import { md5 } from '@/lib/utils';

const MAX_AVATAR_SIZE_MB = 5;

export default function ProfileInfoPage() {
  const { user, updateUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 上传成功后的头像 URL（服务端返回的真实 URL）
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const res = await getUserInfo();
        const result = res.data;

        if (result?.status && result.data) {
          const userInfo = result.data;
          const userData = {
            name: userInfo.name || '',
            email: userInfo.email || '',
            password: '',
            avatar: userInfo.avatar || ''
          };
          setFormData(userData);
          setAvatarPreviewUrl(userInfo.avatar || '');
          setUploadedAvatarUrl(userInfo.avatar || '');

          updateUser({
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.avatar || '',
            created_at: userInfo.created_at
          });
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleAvatarClick = () => {
    if (isUploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 校验文件类型
    if (!file.type.startsWith('image/')) {
      showToastMessage('Please select an image file.', 'error');
      e.target.value = '';
      return;
    }

    // 校验文件大小
    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      showToastMessage(`Image size cannot exceed ${MAX_AVATAR_SIZE_MB}MB.`, 'error');
      e.target.value = '';
      return;
    }

    // 先显示本地预览
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);

    // 立即上传到服务器
    setIsUploadingAvatar(true);
    setUploadProgress(0);
    try {
      const result = await uploadImage(file, {
        upload_type: 'headimg',
        upload_setting: 'cloud',
        onProgress: (percent) => {
          setUploadProgress(percent);
        },
      });
      const serverUrl = result.url;
      const uploadId = String(result.upload_id);

      // 上传成功后，调用修改个人信息接口更新 avatar
      const updateRes = await updateProfileApi({ avatar: uploadId });
      const updateResult = updateRes.data;

      if (updateResult?.status) {
        const updatedUser = updateResult.data;
        updateUser({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          created_at: updatedUser.created_at
        });
        setUploadedAvatarUrl(serverUrl);
        setFormData(prev => ({ ...prev, avatar: serverUrl }));
        showToastMessage('Avatar uploaded and saved successfully!');
      } else {
        throw new Error(updateResult?.error_msg || 'Failed to save avatar');
      }
    } catch (error) {
      setAvatarPreviewUrl(user?.avatar || '');
      setUploadedAvatarUrl(user?.avatar || '');
      setFormData(prev => ({ ...prev, avatar: user?.avatar || '' }));
      showToastMessage('Failed to upload avatar. Please try again.', 'error');
    } finally {
      setIsUploadingAvatar(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const initials = (formData.name || formData.email || user?.email || 'U')
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const updateData: Record<string, string> = {};

      if (formData.name !== (user?.name || '')) {
        updateData.name = formData.name.trim();
      }

      if (formData.email !== (user?.email || '')) {
        updateData.email = formData.email.trim();
      }

      if (formData.password && formData.password.length > 0) {
        updateData.password = md5(formData.password);
      }

      // 头像：使用上传后服务端返回的 URL
      if (uploadedAvatarUrl && uploadedAvatarUrl !== (user?.avatar || '')) {
        updateData.avatar = uploadedAvatarUrl;
      }

      const res = await updateProfileApi(updateData);
      const result = res.data;

      if (result?.status) {
        const updatedUser = result.data;
        updateUser({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          created_at: updatedUser.created_at
        });

        showToastMessage('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        showToastMessage(result?.error_msg || 'Failed to update profile', 'error');
      }
    } catch (error: unknown) {
      const apiError = (error as { response?: { data?: { status?: boolean; error_msg?: string } } })?.response?.data;
      showToastMessage(apiError?.error_msg || 'Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#D8CBB8]" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-['Montserrat'] mb-6">Profile Information</h2>

      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        {/* 头像上传 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-[#F7F5F1] flex items-center justify-center hover:ring-2 hover:ring-[#D8CBB8]/40 transition group"
            title="Click to change avatar"
          >
            {avatarPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreviewUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-[#6C6763]/70">{initials}</span>
            )}

            {/* 上传中遮罩 */}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                {uploadProgress > 0 && (
                  <span className="text-[10px] text-white font-medium">{uploadProgress}%</span>
                )}
              </div>
            )}

            {/* 悬停相机图标 */}
            {!isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </button>

          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">Avatar</div>
            <div className="text-xs text-gray-500">
              {isUploadingAvatar ? 'Uploading...' : 'Click to upload (max 5MB)'}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            onChange={handleAvatarFileChange}
          />
        </div>

        {/* 名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter your full name"
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#D8CBB8]/50'} bg-white focus:outline-none focus:ring-2 transition`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* 邮箱 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email address"
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#D8CBB8]/50'} bg-white focus:outline-none focus:ring-2 transition`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* 密码 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Leave blank to keep current password"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D8CBB8]/50 transition"
          />
          <p className="mt-1 text-xs text-gray-400">Enter a new password to change it (optional)</p>
        </div>

        <Button
          type="submit"
          disabled={isSaving || isUploadingAvatar}
          className="bg-[#D8CBB8] hover:bg-[#C4B5A0] disabled:bg-gray-400 text-white rounded-xl font-bold mt-4 px-8 min-w-[140px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>

      {/* Toast 提示 */}
      {showToast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] ${toastType === 'success' ? 'bg-[#4E554B]' : 'bg-red-600'} text-white px-8 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3`}>
          <div className={`w-5 h-5 ${toastType === 'success' ? 'bg-[#D8CBB8]' : 'bg-white'} rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#D8CBB8]/20`}>
            {toastType === 'success' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
