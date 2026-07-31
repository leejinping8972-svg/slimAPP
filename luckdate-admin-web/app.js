const { createApp, ref, computed, reactive, watch } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const PLAN_STATUS = {
  active: '进行中',
  completed: '已完成',
  awaiting: '待收货',
};

const PLAN_STATUS_TAG = {
  active: 'ok',
  completed: 'info',
  awaiting: 'warn',
};

const BIND_STATUS = {
  unbound: '未绑定',
  bound: '已绑定',
};

/** 外部查单 mock（非后台订单台账） */
const EXTERNAL_ORDERS = [
  {
    id: 'ext1',
    orderNo: 'EXT-20260720-001',
    customerName: 'Freya Lopez',
    phone: '13812345678',
    productId: 'p1',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'ext2',
    orderNo: 'EXT-20260722-014',
    customerName: 'Maya Ruiz',
    phone: '5512345678',
    productId: 'p3',
    productName: 'Youth Solar 维稳装',
  },
  {
    id: 'ext3',
    orderNo: 'EXT-20260718-008',
    customerName: 'Leo Cruz',
    phone: '5598765432',
    productId: 'p1',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'ext4',
    orderNo: 'EXT-20260728-020',
    customerName: 'Sofia Diaz',
    phone: '5588990011',
    productId: 'p2',
    productName: 'Active Boost 14天装',
  },
];

const store = reactive({
  roles: [
    {
      id: 'r1',
      name: '超级管理员',
      description: '全部模块读写',
      permissions: ['全部'],
    },
    {
      id: 'r2',
      name: '运营',
      description: '用户、打卡、方案、基础设置',
      permissions: ['用户管理', '打卡记录', '方案列表', '基础设置'],
    },
    {
      id: 'r3',
      name: '客服',
      description: '用户查看与协助外部查单绑定',
      permissions: ['用户管理', '打卡记录', '方案列表（只读）'],
    },
  ],
  admins: [
    { id: 'a1', username: 'superadmin', roleId: 'r1', enabled: true },
    { id: 'a2', username: 'ops', roleId: 'r2', enabled: true },
    { id: 'a3', username: 'cs', roleId: 'r3', enabled: true },
    { id: 'a4', username: 'ops_backup', roleId: 'r2', enabled: false },
  ],
  users: [
    {
      id: 'u1001',
      nickname: 'Freya',
      email: 'freya@example.com',
      phone: '13812345678',
      region: 'CDMX',
      heightCm: 165,
      weightKg: 58,
      accountStatus: 'active',
      registeredAt: '2026-07-20',
      reminderTime: '21:00',
      remark: '',
      bindStatus: 'bound',
      linkedProductId: 'p1',
      linkedProductName: 'Solar Protein™ 28天装',
      linkedOrderNo: 'EXT-20260720-001',
      planDay: 12,
      planId: 'pl1',
    },
    {
      id: 'u1002',
      nickname: 'Maya',
      email: '',
      phone: '5512345678',
      region: 'Jalisco',
      heightCm: null,
      weightKg: null,
      accountStatus: 'active',
      registeredAt: '2026-07-22',
      reminderTime: '20:30',
      remark: '',
      bindStatus: 'unbound',
      linkedProductId: null,
      linkedProductName: null,
      linkedOrderNo: null,
      planDay: null,
      planId: null,
    },
    {
      id: 'u1003',
      nickname: 'Leo',
      email: 'leo@example.com',
      phone: '5598765432',
      region: 'Nuevo León',
      heightCm: 178,
      weightKg: 82,
      accountStatus: 'disabled',
      registeredAt: '2026-07-18',
      reminderTime: '22:00',
      remark: '测试停用',
      bindStatus: 'bound',
      linkedProductId: 'p1',
      linkedProductName: 'Solar Protein™ 28天装',
      linkedOrderNo: 'EXT-20260718-008',
      planDay: 28,
      planId: 'pl2',
    },
    {
      id: 'u1004',
      nickname: 'Sofia',
      email: 'sofia@example.com',
      phone: '5588990011',
      region: 'CDMX',
      heightCm: 160,
      weightKg: 55,
      accountStatus: 'active',
      registeredAt: '2026-07-28',
      reminderTime: '21:00',
      remark: '',
      bindStatus: 'bound',
      linkedProductId: 'p2',
      linkedProductName: 'Active Boost 14天装',
      linkedOrderNo: 'EXT-20260728-020',
      planDay: null,
      planId: null,
    },
    {
      id: 'u1005',
      nickname: 'Diego',
      email: 'diego@example.com',
      phone: '5577001122',
      region: 'Puebla',
      heightCm: 172,
      weightKg: 70,
      accountStatus: 'active',
      registeredAt: '2026-07-25',
      reminderTime: '21:30',
      remark: '',
      bindStatus: 'bound',
      linkedProductId: 'p1',
      linkedProductName: 'Solar Protein™ 28天装',
      linkedOrderNo: 'EXT-20260725-011',
      planDay: 3,
      planId: 'pl3',
    },
  ],
  checkIns: [
    {
      id: 'ck1',
      userId: 'u1001',
      nickname: 'Freya',
      date: '2026-07-31',
      items: ['体重', '饮水', '睡眠', '代餐'],
      vitalityScore: 86,
    },
    {
      id: 'ck2',
      userId: 'u1005',
      nickname: 'Diego',
      date: '2026-07-31',
      items: ['体重', '饮水', '运动'],
      vitalityScore: 72,
    },
    {
      id: 'ck3',
      userId: 'u1001',
      nickname: 'Freya',
      date: '2026-07-30',
      items: ['体重', '饮水', '睡眠'],
      vitalityScore: 78,
    },
    {
      id: 'ck4',
      userId: 'u1003',
      nickname: 'Leo',
      date: '2026-07-29',
      items: ['体重', '代餐', '睡眠', '饮水', '心情'],
      vitalityScore: 91,
    },
    {
      id: 'ck5',
      userId: 'u1005',
      nickname: 'Diego',
      date: '2026-07-30',
      items: ['体重', '饮水'],
      vitalityScore: 65,
    },
    {
      id: 'ck6',
      userId: 'u1001',
      nickname: 'Freya',
      date: '2026-07-29',
      items: ['体重', '饮水', '代餐', '运动'],
      vitalityScore: 82,
    },
    {
      id: 'ck7',
      userId: 'u1003',
      nickname: 'Leo',
      date: '2026-07-28',
      items: ['体重', '睡眠', '饮水'],
      vitalityScore: 88,
    },
  ],
  plans: [
    {
      id: 'pl1',
      userId: 'u1001',
      nickname: 'Freya',
      day: 12,
      status: 'active',
      startDate: '2026-07-20',
      productId: 'p1',
      productName: 'Solar Protein™ 28天装',
    },
    {
      id: 'pl2',
      userId: 'u1003',
      nickname: 'Leo',
      day: 28,
      status: 'completed',
      startDate: '2026-07-01',
      productId: 'p1',
      productName: 'Solar Protein™ 28天装',
    },
    {
      id: 'pl3',
      userId: 'u1005',
      nickname: 'Diego',
      day: 3,
      status: 'active',
      startDate: '2026-07-29',
      productId: 'p1',
      productName: 'Solar Protein™ 28天装',
    },
    {
      id: 'pl4',
      userId: 'u1006',
      nickname: 'Ana',
      day: 0,
      status: 'awaiting',
      startDate: '2026-07-30',
      productId: 'p1',
      productName: 'Solar Protein™ 28天装',
    },
  ],
  configs: [
    {
      code: 'slim_plan_product_ids',
      description: '28 天方案关联产品',
      value: 'p1',
      unit: '',
    },
  ],
});

function maskPhone(p) {
  if (!p || p.length < 7) return p || '—';
  return p.slice(0, 3) + '****' + p.slice(-4);
}

function roleName(roleId) {
  return store.roles.find((r) => r.id === roleId)?.name || roleId;
}

function slimPlanProductIds() {
  const cfg = store.configs.find((c) => c.code === 'slim_plan_product_ids');
  if (!cfg || !cfg.value) return [];
  return cfg.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toast(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1f2a24',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '8px',
    zIndex: 99,
    fontSize: '14px',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

function planDashboardStats() {
  const today = '2026-07-31';
  const active = store.plans.filter((p) => p.status === 'active').length;
  const awaiting = store.plans.filter((p) => p.status === 'awaiting').length;
  const completed = store.plans.filter((p) => p.status === 'completed').length;
  const checkInsToday = store.checkIns.filter((c) => c.date === today).length;
  const totalEnded = completed + active;
  const completionRate =
    totalEnded === 0 ? 0 : Math.round((completed / (completed + active + awaiting)) * 100);
  return { active, awaiting, completed, checkInsToday, completionRate };
}

const Admins = {
  template: `
  <div class="card">
    <div class="section-head">
      <h3>管理员列表</h3>
    </div>
    <table>
      <thead>
        <tr><th>用户名</th><th>角色</th><th>启用</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="a in store.admins" :key="a.id">
          <td>{{ a.username }}</td>
          <td>{{ roleName(a.roleId) }}</td>
          <td>
            <label>
              <input type="checkbox" :checked="a.enabled" @change="toggle(a, $event)" />
              {{ a.enabled ? '启用' : '停用' }}
            </label>
          </td>
          <td>—</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  setup() {
    function toggle(a, e) {
      a.enabled = e.target.checked;
      toast(a.enabled ? '账号已启用' : '账号已停用');
    }
    return { store, roleName, toggle };
  },
};

const Roles = {
  template: `
  <div class="card">
    <div class="section-head"><h3>角色列表</h3></div>
    <table>
      <thead>
        <tr><th>角色</th><th>说明</th><th>权限范围</th><th>关联管理员数</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in store.roles" :key="r.id">
          <td>{{ r.name }}</td>
          <td>{{ r.description }}</td>
          <td>
            <span v-for="p in r.permissions" :key="p" class="tag" style="margin:2px">{{ p }}</span>
          </td>
          <td>{{ count(r.id) }}</td>
        </tr>
      </tbody>
    </table>
    <p class="hint">演示级角色说明，正式环境可接入细粒度 RBAC。</p>
  </div>`,
  setup() {
    function count(roleId) {
      return store.admins.filter((a) => a.roleId === roleId).length;
    }
    return { store, count };
  },
};

const Users = {
  template: `
  <div class="card">
    <div class="filters">
      <input v-model="q.region" placeholder="地区" />
      <select v-model="q.accountStatus">
        <option value="">账号状态</option>
        <option value="active">启用</option>
        <option value="disabled">停用</option>
      </select>
      <select v-model="q.bindStatus">
        <option value="">绑定状态</option>
        <option value="bound">已绑定</option>
        <option value="unbound">未绑定</option>
      </select>
      <button class="btn" @click="noop">查询</button>
      <button class="btn ghost" @click="reset">重置</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>用户 ID</th>
          <th>昵称 / 联系方式</th>
          <th>地区</th>
          <th>身高 / 体重</th>
          <th>绑定</th>
          <th>方案天数</th>
          <th>注册时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in filtered" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.nickname }} · {{ u.email || maskPhone(u.phone) }}</td>
          <td>{{ u.region }}</td>
          <td>{{ u.heightCm ? u.heightCm + ' cm' : '—' }} / {{ u.weightKg ? u.weightKg + ' kg' : '—' }}</td>
          <td>
            <span class="tag" :class="u.bindStatus === 'bound' ? 'ok' : 'muted'">
              {{ BIND_STATUS[u.bindStatus] }}
            </span>
          </td>
          <td>{{ u.planDay != null ? 'Day ' + u.planDay : '—' }}</td>
          <td>{{ u.registeredAt }}</td>
          <td><button class="btn ghost" @click="$router.push('/users/' + u.id)">查看详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>`,
  setup() {
    const q = reactive({ region: '', accountStatus: '', bindStatus: '' });
    const filtered = computed(() =>
      store.users.filter((u) => {
        if (q.region && !u.region.toLowerCase().includes(q.region.toLowerCase())) return false;
        if (q.accountStatus && u.accountStatus !== q.accountStatus) return false;
        if (q.bindStatus && u.bindStatus !== q.bindStatus) return false;
        return true;
      }),
    );
    return {
      q,
      filtered,
      maskPhone,
      BIND_STATUS,
      reset: () => Object.assign(q, { region: '', accountStatus: '', bindStatus: '' }),
      noop: () => {},
    };
  },
};

const UserDetail = {
  props: ['id'],
  template: `
  <div>
    <div class="card" v-if="user">
      <div class="section-head">
        <h3>用户详情 · {{ user.nickname }}</h3>
        <div style="display:flex;gap:8px">
          <button class="btn ghost" @click="$router.push('/users')">返回</button>
          <button class="btn" @click="openLink=true">协助外部查单绑定</button>
        </div>
      </div>
      <table>
        <tr>
          <th>昵称</th><td>{{ user.nickname }}</td>
          <th>账号</th><td>{{ user.email || maskPhone(user.phone) }}</td>
        </tr>
        <tr>
          <th>地区</th><td>{{ user.region }}</td>
          <th>身高 / 体重</th>
          <td>{{ user.heightCm || '—' }} / {{ user.weightKg || '—' }}</td>
        </tr>
        <tr>
          <th>提醒时间</th><td>{{ user.reminderTime || '—' }}</td>
          <th>账号状态</th>
          <td>
            <span class="tag" :class="user.accountStatus==='active'?'ok':'warn'">
              {{ user.accountStatus==='active'?'启用':'停用' }}
            </span>
          </td>
        </tr>
        <tr>
          <th>绑定状态</th>
          <td>
            <span class="tag" :class="user.bindStatus==='bound'?'ok':'muted'">
              {{ BIND_STATUS[user.bindStatus] }}
            </span>
          </td>
          <th>方案进度</th>
          <td>{{ user.planDay != null ? 'Day ' + user.planDay : '未开通' }}</td>
        </tr>
        <tr>
          <th>备注</th>
          <td colspan="3">
            <input v-model="remark" style="width:70%" />
            <button class="btn ghost" @click="saveRemark">保存</button>
          </td>
        </tr>
      </table>
    </div>

    <div class="card">
      <h3 style="margin-top:0">已绑定产品</h3>
      <div v-if="user && user.bindStatus==='bound'" >
        <table>
          <thead>
            <tr><th>外部单号</th><th>产品 ID</th><th>产品名称</th><th>是否开通方案</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ user.linkedOrderNo || '—' }}</td>
              <td><code>{{ user.linkedProductId }}</code></td>
              <td>{{ user.linkedProductName }}</td>
              <td>
                <span class="tag" :class="user.planId ? 'ok' : 'muted'">
                  {{ user.planId ? '已开通' : '未开通（产品不在方案配置内）' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty">暂无绑定产品。可通过「协助外部查单绑定」写入关联产品。</div>
    </div>

    <div class="card">
      <div class="section-head">
        <h3>近期打卡</h3>
        <button class="btn ghost" @click="$router.push('/check-ins?userId=' + id)">查看全部打卡</button>
      </div>
      <div v-if="!userCheckIns.length" class="empty">暂无打卡记录</div>
      <table v-else>
        <thead>
          <tr><th>日期</th><th>记录项</th><th>活力分</th></tr>
        </thead>
        <tbody>
          <tr v-for="c in userCheckIns" :key="c.id">
            <td>{{ c.date }}</td>
            <td>{{ c.items.join('、') }}</td>
            <td>{{ c.vitalityScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-mask" v-if="openLink">
      <div class="modal">
        <h3>协助外部查单绑定</h3>
        <p class="hint" style="margin-top:0">按客户姓名 + 手机后四位预览外部订单；确认后写入用户关联产品。若产品 ID 属于 slim_plan_product_ids，则开通 28 天方案。</p>
        <div class="form-row"><label>客户姓名</label><input v-model="link.name" placeholder="如 Freya Lopez" /></div>
        <div class="form-row"><label>手机后四位</label><input v-model="link.last4" maxlength="4" placeholder="5678" /></div>
        <button class="btn ghost" @click="preview">预览命中订单</button>
        <table v-if="previewList.length" style="margin-top:12px">
          <thead><tr><th></th><th>外部单号</th><th>客户</th><th>产品</th></tr></thead>
          <tbody>
            <tr v-for="o in previewList" :key="o.id">
              <td><input type="radio" :value="o.id" v-model="link.orderId" /></td>
              <td>{{ o.orderNo }}</td>
              <td>{{ o.customerName }}</td>
              <td>{{ o.productName }} <code style="margin-left:4px">{{ o.productId }}</code></td>
            </tr>
          </tbody>
        </table>
        <div class="modal-actions">
          <button class="btn ghost" @click="openLink=false">取消</button>
          <button class="btn" @click="confirmLink">确认绑定</button>
        </div>
      </div>
    </div>
  </div>`,
  setup(props) {
    const user = computed(() => store.users.find((u) => u.id === props.id));
    const remark = ref(user.value?.remark || '');
    watch(user, (u) => (remark.value = u?.remark || ''));
    const userCheckIns = computed(() =>
      store.checkIns.filter((c) => c.userId === props.id).slice(0, 5),
    );
    const openLink = ref(false);
    const link = reactive({ name: '', last4: '', orderId: '' });
    const previewList = ref([]);

    function preview() {
      previewList.value = EXTERNAL_ORDERS.filter(
        (o) =>
          o.customerName.toLowerCase() === link.name.trim().toLowerCase() &&
          o.phone.endsWith(link.last4),
      );
      if (!previewList.value.length) toast('未命中外部订单');
    }

    function confirmLink() {
      if (!link.orderId || !user.value) return toast('请选择订单');
      const order = EXTERNAL_ORDERS.find((o) => o.id === link.orderId);
      if (!order) return toast('订单不存在');

      const u = user.value;
      u.bindStatus = 'bound';
      u.linkedProductId = order.productId;
      u.linkedProductName = order.productName;
      u.linkedOrderNo = order.orderNo;

      const eligible = slimPlanProductIds().includes(order.productId);
      if (eligible) {
        let plan = store.plans.find((p) => p.userId === u.id && p.status !== 'completed');
        if (!plan) {
          plan = {
            id: 'pl' + Date.now(),
            userId: u.id,
            nickname: u.nickname,
            day: 0,
            status: 'awaiting',
            startDate: '2026-07-31',
            productId: order.productId,
            productName: order.productName,
          };
          store.plans.push(plan);
        } else {
          plan.productId = order.productId;
          plan.productName = order.productName;
        }
        u.planId = plan.id;
        u.planDay = plan.day;
        openLink.value = false;
        toast('绑定成功，已开通 / 关联 28 天方案');
      } else {
        u.planId = null;
        u.planDay = null;
        openLink.value = false;
        toast('绑定成功（产品不在方案配置内，未开通方案）');
      }
    }

    function saveRemark() {
      if (user.value) user.value.remark = remark.value;
      toast('备注已保存');
    }

    return {
      user,
      remark,
      userCheckIns,
      openLink,
      link,
      previewList,
      preview,
      confirmLink,
      saveRemark,
      maskPhone,
      BIND_STATUS,
    };
  },
};

const CheckIns = {
  template: `
  <div class="card">
    <div class="filters">
      <input v-model="q.nickname" placeholder="用户昵称" />
      <input v-model="q.date" type="date" />
      <button class="btn" @click="noop">查询</button>
      <button class="btn ghost" @click="reset">重置</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>用户</th><th>日期</th><th>记录项</th><th>活力分</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in filtered" :key="c.id">
          <td>{{ c.nickname }} <span style="color:#889;font-size:12px">{{ c.userId }}</span></td>
          <td>{{ c.date }}</td>
          <td>
            <span v-for="it in c.items" :key="it" class="tag" style="margin:2px">{{ it }}</span>
          </td>
          <td><strong>{{ c.vitalityScore }}</strong></td>
          <td><button class="btn ghost" @click="$router.push('/users/' + c.userId)">用户详情</button></td>
        </tr>
      </tbody>
    </table>
    <div v-if="!filtered.length" class="empty">无匹配打卡记录</div>
  </div>`,
  setup() {
    const route = VueRouter.useRoute();
    const q = reactive({
      nickname: '',
      date: '',
      userId: route.query.userId || '',
    });
    watch(
      () => route.query.userId,
      (v) => {
        q.userId = v || '';
      },
    );
    const filtered = computed(() =>
      store.checkIns.filter((c) => {
        if (q.userId && c.userId !== q.userId) return false;
        if (q.nickname && !c.nickname.toLowerCase().includes(q.nickname.toLowerCase()))
          return false;
        if (q.date && c.date !== q.date) return false;
        return true;
      }),
    );
    return {
      q,
      filtered,
      reset: () => Object.assign(q, { nickname: '', date: '', userId: '' }),
      noop: () => {},
    };
  },
};

const Plans = {
  template: `
  <div>
    <div class="stats">
      <div class="stat"><div class="n">{{ stats.active }}</div><div class="l">进行中方案</div></div>
      <div class="stat"><div class="n">{{ stats.awaiting }}</div><div class="l">待收货</div></div>
      <div class="stat"><div class="n">{{ stats.checkInsToday }}</div><div class="l">今日打卡</div></div>
      <div class="stat"><div class="n">{{ stats.completionRate }}%</div><div class="l">完成率</div></div>
    </div>
    <div class="card">
      <div class="section-head">
        <h3>28 天方案实例</h3>
        <span style="color:#667;font-size:13px">已完成 {{ stats.completed }} · 合计 {{ store.plans.length }}</span>
      </div>
      <div class="filters">
        <input v-model="q.nickname" placeholder="用户昵称" />
        <select v-model="q.status">
          <option value="">方案状态</option>
          <option value="active">进行中</option>
          <option value="completed">已完成</option>
          <option value="awaiting">待收货</option>
        </select>
        <input v-model="q.startFrom" type="date" title="开始日期起" />
        <button class="btn" @click="noop">查询</button>
        <button class="btn ghost" @click="reset">重置</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>方案 ID</th><th>用户</th><th>当前天数</th><th>状态</th>
            <th>开始日期</th><th>关联产品</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.nickname }} <span style="color:#889;font-size:12px">{{ p.userId }}</span></td>
            <td>Day {{ p.day }}</td>
            <td><span class="tag" :class="PLAN_STATUS_TAG[p.status]">{{ PLAN_STATUS[p.status] }}</span></td>
            <td>{{ p.startDate }}</td>
            <td>{{ p.productName }} <code style="margin-left:4px">{{ p.productId }}</code></td>
            <td>
              <button
                v-if="p.userId && store.users.some(u => u.id === p.userId)"
                class="btn ghost"
                @click="$router.push('/users/' + p.userId)"
              >用户</button>
              <span v-else style="color:#889">—</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty">无匹配方案</div>
    </div>
  </div>`,
  setup() {
    const q = reactive({ nickname: '', status: '', startFrom: '' });
    const stats = computed(() => planDashboardStats());
    const filtered = computed(() =>
      store.plans.filter((p) => {
        if (q.nickname && !p.nickname.toLowerCase().includes(q.nickname.toLowerCase()))
          return false;
        if (q.status && p.status !== q.status) return false;
        if (q.startFrom && p.startDate < q.startFrom) return false;
        return true;
      }),
    );
    return {
      store,
      q,
      stats,
      filtered,
      PLAN_STATUS,
      PLAN_STATUS_TAG,
      reset: () => Object.assign(q, { nickname: '', status: '', startFrom: '' }),
      noop: () => {},
    };
  },
};

const Configs = {
  template: `
  <div class="card">
    <div class="section-head"><h3>基础设置</h3></div>
    <p class="hint" style="margin-top:0">仅保留 28 天方案关联产品配置。已移除复购推荐 / 注册送券等电商相关项。</p>
    <table>
      <thead>
        <tr><th>配置编码</th><th>配置说明</th><th>配置值</th><th>单位</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="c in store.configs" :key="c.code">
          <td><code>{{ c.code }}</code></td>
          <td>{{ c.description }}</td>
          <td>{{ c.value }}</td>
          <td>{{ c.unit || '—' }}</td>
          <td><button class="btn ghost" @click="edit(c)">编辑</button></td>
        </tr>
      </tbody>
    </table>
    <div class="modal-mask" v-if="show">
      <div class="modal">
        <h3>编辑配置</h3>
        <div class="form-row"><label>编码</label><input :value="form.code" disabled /></div>
        <div class="form-row"><label>说明</label><input :value="form.description" disabled /></div>
        <div class="form-row">
          <label>配置值（产品 ID，多个用英文逗号分隔）</label>
          <input v-model="form.value" placeholder="如 p1,p2" />
        </div>
        <div class="modal-actions">
          <button class="btn ghost" @click="show=false">取消</button>
          <button class="btn" @click="save">确认</button>
        </div>
      </div>
    </div>
  </div>`,
  setup() {
    const show = ref(false);
    const form = reactive({ code: '', description: '', value: '' });
    function edit(c) {
      Object.assign(form, c);
      show.value = true;
    }
    function save() {
      const normalized = form.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(',');
      const item = store.configs.find((x) => x.code === form.code);
      if (item) item.value = normalized;
      show.value = false;
      toast('配置已保存');
    }
    return { store, show, form, edit, save };
  },
};

const routes = [
  { path: '/', redirect: '/plans' },
  { path: '/admins', component: Admins },
  { path: '/roles', component: Roles },
  { path: '/users', component: Users },
  { path: '/users/:id', component: UserDetail, props: true },
  { path: '/check-ins', component: CheckIns },
  { path: '/plans', component: Plans },
  { path: '/configs', component: Configs },
];

const router = createRouter({ history: createWebHashHistory(), routes });

const App = {
  template: `
  <div class="layout">
    <aside class="sider">
      <div class="brand">luckdate<span>管理后台 · 中文</span></div>
      <nav class="menu">
        <div class="menu-group">
          <div class="menu-group-title">管理员配置</div>
          <router-link to="/admins">管理员列表</router-link>
          <router-link to="/roles">角色列表</router-link>
        </div>
        <div class="menu-group">
          <div class="menu-group-title">用户管理</div>
          <router-link to="/users">用户列表</router-link>
          <router-link to="/check-ins">用户打卡记录</router-link>
        </div>
        <div class="menu-group">
          <div class="menu-group-title">方案列表</div>
          <router-link to="/plans">方案看板</router-link>
        </div>
        <div class="menu-group">
          <div class="menu-group-title">系统设置</div>
          <router-link to="/configs">基础设置</router-link>
        </div>
      </nav>
    </aside>
    <div class="main">
      <header class="topbar">
        <div>{{ title }}</div>
        <div style="color:#667;font-size:13px">演示账号 · 静态 Mock · 无电商模块</div>
      </header>
      <main class="content"><router-view /></main>
    </div>
  </div>`,
  setup() {
    const titles = {
      '/admins': '管理员列表',
      '/roles': '角色列表',
      '/users': '用户列表',
      '/check-ins': '用户打卡记录',
      '/plans': '28 天方案看板',
      '/configs': '基础设置',
    };
    const title = computed(() => {
      const p = router.currentRoute.value.path;
      if (p.startsWith('/users/')) return '用户详情';
      return titles[p] || 'luckdate';
    });
    return { title };
  },
};

createApp(App).use(router).mount('#app');
