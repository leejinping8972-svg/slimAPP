const { createApp, ref, computed, reactive, watch } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const ORDER_STATUS = {
  unpaid: '未支付',
  paid: '已付款',
  cancelled: '已取消',
};
const LOGISTICS = {
  placed: '已下单',
  shipped: '已发货',
  arrived: '到达待取',
  received: '客户已收',
  problem: '问题件',
};

const store = reactive({
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
      remark: '',
      linkedOrderIds: ['o2001'],
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
      remark: '',
      linkedOrderIds: [],
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
      remark: '测试停用',
      linkedOrderIds: ['o2003'],
    },
  ],
  orders: [
    {
      id: 'o2001',
      orderNo: 'LD-20260720-001',
      customerName: 'Freya Lopez',
      phone: '13812345678',
      productName: 'Solar Protein™',
      sku: 'SP-28',
      orderStatus: 'paid',
      logisticsStatus: 'received',
      orderedAt: '2026-07-20 10:21',
      region: 'CDMX',
      receiverAddress: 'Calle Reforma 100, CDMX',
      amount: 89,
    },
    {
      id: 'o2002',
      orderNo: 'LD-20260721-014',
      customerName: 'Ana Ruiz',
      phone: '5511223344',
      productName: 'Youth Solar',
      sku: 'YS-30',
      orderStatus: 'paid',
      logisticsStatus: 'shipped',
      orderedAt: '2026-07-21 16:02',
      region: 'Jalisco',
      receiverAddress: 'Av. Vallarta 200, GDL',
      amount: 79,
    },
    {
      id: 'o2003',
      orderNo: 'LD-20260718-008',
      customerName: 'Leo Cruz',
      phone: '5598765432',
      productName: 'Active Boost',
      sku: 'AB-14',
      orderStatus: 'unpaid',
      logisticsStatus: 'placed',
      orderedAt: '2026-07-18 09:40',
      region: 'Nuevo León',
      receiverAddress: 'Centro 12, MTY',
      amount: 49,
    },
    {
      id: 'o2004',
      orderNo: 'LD-20260725-033',
      customerName: 'Sofia Diaz',
      phone: '5588990011',
      productName: 'Solar Protein™',
      sku: 'SP-28',
      orderStatus: 'cancelled',
      logisticsStatus: 'problem',
      orderedAt: '2026-07-25 12:11',
      region: 'CDMX',
      receiverAddress: 'Roma Nte. 45',
      amount: 89,
    },
  ],
  products: [
    {
      id: 'p1',
      name: 'Solar Protein™',
      price: 89,
      stock: 120,
      onSale: true,
      specs: '28 天装',
      description: '代餐蛋白粉主商品',
    },
    {
      id: 'p2',
      name: 'Youth Solar',
      price: 79,
      stock: 80,
      onSale: true,
      specs: '30 天装',
      description: '维稳阶段推荐',
    },
  ],
  coupons: [
    {
      id: 'c1',
      name: '注册欢迎券',
      type: 'full_reduction',
      thresholdUsd: 50,
      discountValue: 10,
      validityType: 'days_after_claim',
      daysAfterClaim: 30,
      totalQuantity: 0,
      perUserLimit: 1,
      productScope: 'all',
      productIds: [],
      enabled: true,
    },
    {
      id: 'c2',
      name: '满减券',
      type: 'full_reduction',
      thresholdUsd: 80,
      discountValue: 15,
      validityType: 'fixed_date',
      startAt: '2026-07-01',
      endAt: '2026-08-31',
      totalQuantity: 500,
      perUserLimit: 1,
      productScope: 'specified',
      productIds: ['p1'],
      enabled: true,
    },
  ],
  batches: [
    { id: 'b1', couponId: 'c1', couponName: '注册欢迎券', userCount: 128, createdAt: '2026-07-20' },
  ],
  configs: [
    {
      code: 'slim_plan_product_ids',
      description: '28 天方案关联产品',
      value: 'p1',
      unit: '',
    },
    {
      code: 'repurchase_recommend_product_ids',
      description: '复购推荐产品',
      value: 'p1,p2',
      unit: '',
    },
    {
      code: 'register_gift_coupon_ids',
      description: '注册赠送优惠券',
      value: 'c1',
      unit: '',
    },
  ],
  admins: [
    { id: 'a1', username: 'superadmin', role: '超级管理员', enabled: true },
    { id: 'a2', username: 'ops', role: '运营', enabled: true },
  ],
});

function maskPhone(p) {
  if (!p || p.length < 7) return p || '—';
  return p.slice(0, 3) + '****' + p.slice(-4);
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

const Dashboard = {
  template: `
  <div>
    <div class="stats">
      <div class="stat" @click="$router.push('/users')"><div class="n">{{ stats.reg }}</div><div class="l">今日注册</div></div>
      <div class="stat" @click="$router.push('/orders')"><div class="n">{{ stats.orders }}</div><div class="l">今日订单</div></div>
      <div class="stat" @click="$router.push('/coupons')"><div class="n">{{ stats.issued }}</div><div class="l">券发放</div></div>
      <div class="stat" @click="$router.push('/coupons')"><div class="n">{{ stats.used }}</div><div class="l">券使用</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <h3 style="margin-top:0">luckdate 运营后台预览</h3>
      <p style="color:#667;line-height:1.6">本页为静态演示环境（中文界面），数据为内存 Mock，可点通列表/详情/编辑/协助关联等交互。正式环境请对接真实 API。</p>
    </div>
  </div>`,
  setup() {
    const stats = computed(() => ({
      reg: store.users.filter((u) => u.registeredAt >= '2026-07-27').length || 2,
      orders: store.orders.filter((o) => o.orderedAt.startsWith('2026-07-2')).length,
      issued: 128,
      used: 36,
    }));
    return { stats };
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
      <button class="btn" @click="noop">查询</button>
      <button class="btn ghost" @click="reset">重置</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>用户 ID</th><th>昵称 / 联系方式</th><th>地区</th><th>身高 / 体重</th><th>注册时间</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in filtered" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.nickname }} · {{ u.email || maskPhone(u.phone) }}</td>
          <td>{{ u.region }}</td>
          <td>{{ u.heightCm ? u.heightCm + ' cm' : '—' }} / {{ u.weightKg ? u.weightKg + ' kg' : '—' }}</td>
          <td>{{ u.registeredAt }}</td>
          <td><button class="btn ghost" @click="$router.push('/users/' + u.id)">查看详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>`,
  setup() {
    const q = reactive({ region: '', accountStatus: '' });
    const filtered = computed(() =>
      store.users.filter((u) => {
        if (q.region && !u.region.toLowerCase().includes(q.region.toLowerCase())) return false;
        if (q.accountStatus && u.accountStatus !== q.accountStatus) return false;
        return true;
      }),
    );
    return {
      q,
      filtered,
      maskPhone,
      reset: () => Object.assign(q, { region: '', accountStatus: '' }),
      noop: () => {},
    };
  },
};

const UserDetail = {
  props: ['id'],
  template: `
  <div>
    <div class="card" v-if="user">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0">用户详情 · {{ user.nickname }}</h3>
        <div style="display:flex;gap:8px">
          <button class="btn ghost" @click="$router.push('/users')">返回</button>
          <button class="btn" @click="openLink=true">协助关联订单</button>
        </div>
      </div>
      <table style="margin-top:16px">
        <tr><th>昵称</th><td>{{ user.nickname }}</td><th>账号</th><td>{{ user.email || maskPhone(user.phone) }}</td></tr>
        <tr><th>地区</th><td>{{ user.region }}</td><th>身高/体重</th><td>{{ user.heightCm || '—' }} / {{ user.weightKg || '—' }}</td></tr>
        <tr><th>提醒时间</th><td>21:00</td><th>备注</th>
          <td><input v-model="remark" style="width:70%" /> <button class="btn ghost" @click="saveRemark">保存</button></td></tr>
      </table>
    </div>
    <div class="card">
      <h3 style="margin-top:0">已关联订单</h3>
      <div v-if="!linked.length" class="empty">暂无关联订单</div>
      <table v-else>
        <thead><tr><th>订单号</th><th>商品</th><th>下单时间</th><th>物流状态</th></tr></thead>
        <tbody>
          <tr v-for="o in linked" :key="o.id">
            <td>{{ o.orderNo }}</td><td>{{ o.productName }}</td><td>{{ o.orderedAt }}</td>
            <td><span class="tag">{{ LOGISTICS[o.logisticsStatus] }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card"><h3 style="margin-top:0">打卡摘要（可选）</h3><p class="empty" style="padding:8px 0">近 7 日打卡摘要：演示数据 · 3/7 天有记录</p></div>

    <div class="modal-mask" v-if="openLink">
      <div class="modal">
        <h3>协助关联订单</h3>
        <div class="form-row"><label>客户姓名</label><input v-model="link.name" /></div>
        <div class="form-row"><label>手机后四位</label><input v-model="link.last4" maxlength="4" /></div>
        <button class="btn ghost" @click="preview">预览命中订单</button>
        <table v-if="previewList.length" style="margin-top:12px">
          <thead><tr><th></th><th>订单号</th><th>客户</th><th>商品</th></tr></thead>
          <tbody>
            <tr v-for="o in previewList" :key="o.id">
              <td><input type="radio" :value="o.id" v-model="link.orderId" /></td>
              <td>{{ o.orderNo }}</td><td>{{ o.customerName }}</td><td>{{ o.productName }}</td>
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
    const linked = computed(() =>
      (user.value?.linkedOrderIds || [])
        .map((id) => store.orders.find((o) => o.id === id))
        .filter(Boolean),
    );
    const openLink = ref(false);
    const link = reactive({ name: '', last4: '', orderId: '' });
    const previewList = ref([]);
    function preview() {
      previewList.value = store.orders.filter(
        (o) =>
          o.customerName.toLowerCase() === link.name.trim().toLowerCase() &&
          o.phone.endsWith(link.last4),
      );
      if (!previewList.value.length) toast('未命中订单');
    }
    function confirmLink() {
      if (!link.orderId || !user.value) return toast('请选择订单');
      if (!user.value.linkedOrderIds.includes(link.orderId)) {
        user.value.linkedOrderIds.push(link.orderId);
      }
      openLink.value = false;
      toast('关联成功');
    }
    function saveRemark() {
      if (user.value) user.value.remark = remark.value;
      toast('备注已保存');
    }
    return {
      user,
      linked,
      remark,
      openLink,
      link,
      previewList,
      preview,
      confirmLink,
      saveRemark,
      maskPhone,
      LOGISTICS,
    };
  },
};

const Orders = {
  template: `
  <div class="card">
    <div class="filters">
      <input v-model="q.orderNo" placeholder="订单号" />
      <input v-model="q.customerName" placeholder="客户姓名" />
      <input v-model="q.last4" placeholder="手机后四位" maxlength="4" />
      <select v-model="q.orderStatus">
        <option value="">订单状态</option>
        <option v-for="(l,k) in ORDER_STATUS" :key="k" :value="k">{{ l }}</option>
      </select>
      <select v-model="q.logisticsStatus">
        <option value="">物流状态</option>
        <option v-for="(l,k) in LOGISTICS" :key="k" :value="k">{{ l }}</option>
      </select>
      <button class="btn ghost" @click="Object.assign(q,{orderNo:'',customerName:'',last4:'',orderStatus:'',logisticsStatus:''})">重置</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>订单号</th><th>客户姓名</th><th>手机</th><th>商品</th>
          <th>订单状态</th><th>物流状态</th><th>下单时间</th><th>地区</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in filtered" :key="o.id">
          <td>{{ o.orderNo }}</td>
          <td>{{ o.customerName }}</td>
          <td>{{ maskPhone(o.phone) }}</td>
          <td>{{ o.productName }}</td>
          <td><span class="tag">{{ ORDER_STATUS[o.orderStatus] }}</span></td>
          <td><span class="tag ok">{{ LOGISTICS[o.logisticsStatus] }}</span></td>
          <td>{{ o.orderedAt }}</td>
          <td>{{ o.region }}</td>
          <td><button class="btn ghost" @click="$router.push('/orders/' + o.id)">详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>`,
  setup() {
    const q = reactive({
      orderNo: '',
      customerName: '',
      last4: '',
      orderStatus: '',
      logisticsStatus: '',
    });
    const filtered = computed(() =>
      store.orders.filter((o) => {
        if (q.orderNo && !o.orderNo.includes(q.orderNo)) return false;
        if (q.customerName && !o.customerName.toLowerCase().includes(q.customerName.toLowerCase()))
          return false;
        if (q.last4 && !o.phone.endsWith(q.last4)) return false;
        if (q.orderStatus && o.orderStatus !== q.orderStatus) return false;
        if (q.logisticsStatus && o.logisticsStatus !== q.logisticsStatus) return false;
        return true;
      }),
    );
    return { q, filtered, maskPhone, ORDER_STATUS, LOGISTICS };
  },
};

const OrderDetail = {
  props: ['id'],
  template: `
  <div class="card" v-if="o">
    <div style="display:flex;justify-content:space-between">
      <h3 style="margin:0">订单详情 · {{ o.orderNo }}</h3>
      <button class="btn ghost" @click="$router.push('/orders')">返回</button>
    </div>
    <table style="margin-top:16px">
      <tr><th>订单状态</th><td>{{ ORDER_STATUS[o.orderStatus] }}</td><th>物流状态</th><td>{{ LOGISTICS[o.logisticsStatus] }}</td></tr>
      <tr><th>客户</th><td>{{ o.customerName }}</td><th>手机</th><td>{{ maskPhone(o.phone) }}</td></tr>
      <tr><th>商品</th><td>{{ o.productName }} / {{ o.sku }}</td><th>金额</th><td>$ {{ o.amount }}</td></tr>
      <tr><th>下单时间</th><td>{{ o.orderedAt }}</td><th>地区</th><td>{{ o.region }}</td></tr>
      <tr><th>收件地址</th><td colspan="3">{{ o.receiverAddress }}</td></tr>
    </table>
  </div>`,
  setup(props) {
    const o = computed(() => store.orders.find((x) => x.id === props.id));
    return { o, ORDER_STATUS, LOGISTICS, maskPhone };
  },
};

const Products = {
  template: `
  <div class="card">
    <div style="display:flex;justify-content:space-between;margin-bottom:12px">
      <h3 style="margin:0">商品列表</h3>
      <button class="btn" @click="openEdit()">新增</button>
    </div>
    <table>
      <thead><tr><th>名称</th><th>价格</th><th>库存</th><th>上下架</th><th>规格</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="p in store.products" :key="p.id">
          <td>{{ p.name }}</td><td>$ {{ p.price }}</td><td>{{ p.stock }}</td>
          <td><span class="tag" :class="p.onSale?'ok':'warn'">{{ p.onSale?'上架':'下架' }}</span></td>
          <td>{{ p.specs }}</td>
          <td><button class="btn ghost" @click="openEdit(p)">编辑</button></td>
        </tr>
      </tbody>
    </table>
    <div class="modal-mask" v-if="show">
      <div class="modal">
        <h3>{{ form.id ? '编辑商品' : '新增商品' }}</h3>
        <div class="form-row"><label>名称</label><input v-model="form.name" /></div>
        <div class="form-row"><label>价格</label><input type="number" v-model.number="form.price" /></div>
        <div class="form-row"><label>库存</label><input type="number" v-model.number="form.stock" /></div>
        <div class="form-row"><label>规格</label><input v-model="form.specs" /></div>
        <div class="form-row"><label>描述</label><textarea v-model="form.description" rows="3"></textarea></div>
        <div class="form-row"><label><input type="checkbox" v-model="form.onSale" /> 上架</label></div>
        <p style="color:#889;font-size:12px">不提供：是否代餐 / 复购角色 / 可用欢迎券</p>
        <div class="modal-actions">
          <button class="btn ghost" @click="show=false">取消</button>
          <button class="btn" @click="save">确认</button>
        </div>
      </div>
    </div>
  </div>`,
  setup() {
    const show = ref(false);
    const form = reactive({});
    function openEdit(p) {
      Object.assign(form, p || { id: '', name: '', price: 0, stock: 0, specs: '', description: '', onSale: true });
      show.value = true;
    }
    function save() {
      if (!form.name) return toast('请填写名称');
      if (form.id) {
        const i = store.products.findIndex((x) => x.id === form.id);
        store.products[i] = { ...form };
      } else {
        store.products.push({ ...form, id: 'p' + Date.now() });
      }
      show.value = false;
      toast('已保存');
    }
    return { store, show, form, openEdit, save };
  },
};

const Coupons = {
  template: `
  <div class="card">
    <div style="display:flex;justify-content:space-between;margin-bottom:12px">
      <h3 style="margin:0">优惠券列表</h3>
      <div style="display:flex;gap:8px">
        <button class="btn ghost" @click="$router.push('/coupon-batches')">批量发放列表</button>
        <button class="btn" @click="openEdit()">新增优惠券</button>
      </div>
    </div>
    <table>
      <thead><tr><th>名称</th><th>类型</th><th>门槛/额度</th><th>有效期</th><th>启用</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="c in store.coupons" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ typeLabel(c.type) }}</td>
          <td>满 {{ c.thresholdUsd }} 减 {{ c.discountValue }}</td>
          <td>{{ c.validityType==='fixed_date' ? (c.startAt+' ~ '+c.endAt) : ('领取后 '+c.daysAfterClaim+' 天') }}</td>
          <td>{{ c.enabled?'启用':'停用' }}</td>
          <td>
            <button class="btn ghost" @click="openEdit(c)">编辑</button>
            <button class="btn danger" @click="del(c.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal-mask" v-if="show">
      <div class="modal">
        <h3>{{ form.id?'编辑':'新增' }}优惠券</h3>
        <div class="form-row"><label>名称</label><input v-model="form.name" /></div>
        <div class="form-row"><label>类型</label>
          <select v-model="form.type">
            <option value="full_reduction">满减券</option>
            <option value="discount">折扣券</option>
            <option value="no_threshold">无门槛券</option>
          </select>
        </div>
        <div class="form-row" v-if="form.type==='full_reduction'"><label>满减门槛（美元）</label><input type="number" v-model.number="form.thresholdUsd" /></div>
        <div class="form-row"><label>{{ form.type==='discount'?'折扣':'减免金额（美元）' }}</label><input type="number" v-model.number="form.discountValue" /></div>
        <div class="form-row"><label>有效期类型</label>
          <select v-model="form.validityType">
            <option value="fixed_date">指定日期</option>
            <option value="days_after_claim">领取后有效期</option>
          </select>
        </div>
        <div class="form-row" v-if="form.validityType==='fixed_date'">
          <label>开始 / 结束</label>
          <input v-model="form.startAt" placeholder="YYYY-MM-DD" />
          <input v-model="form.endAt" placeholder="YYYY-MM-DD" style="margin-top:6px" />
        </div>
        <div class="form-row" v-else><label>领取后 N 天</label><input type="number" v-model.number="form.daysAfterClaim" /></div>
        <div class="form-row"><label>发放总量（0=不限）</label><input type="number" v-model.number="form.totalQuantity" /></div>
        <div class="form-row"><label>单人限领</label><input type="number" v-model.number="form.perUserLimit" /></div>
        <div class="form-row"><label>商品范围</label>
          <select v-model="form.productScope">
            <option value="all">全部商品</option>
            <option value="specified">指定商品</option>
            <option value="include_specified_order">包含指定商品后整单计算</option>
          </select>
        </div>
        <div class="form-row" v-if="form.productScope!=='all'">
          <label>指定商品 ID（逗号分隔）</label>
          <input v-model="productIdsText" />
        </div>
        <div class="form-row"><label><input type="checkbox" v-model="form.enabled" /> 启用</label></div>
        <div class="modal-actions">
          <button class="btn ghost" @click="show=false">取消</button>
          <button class="btn" @click="save">确认</button>
        </div>
      </div>
    </div>
  </div>`,
  setup() {
    const show = ref(false);
    const form = reactive({});
    const productIdsText = ref('');
    function typeLabel(t) {
      return { full_reduction: '满减券', discount: '折扣券', no_threshold: '无门槛券' }[t] || t;
    }
    function openEdit(c) {
      Object.assign(
        form,
        c || {
          id: '',
          name: '',
          type: 'full_reduction',
          thresholdUsd: 0,
          discountValue: 10,
          validityType: 'days_after_claim',
          daysAfterClaim: 30,
          totalQuantity: 0,
          perUserLimit: 1,
          productScope: 'all',
          productIds: [],
          enabled: true,
        },
      );
      productIdsText.value = (form.productIds || []).join(',');
      show.value = true;
    }
    function save() {
      form.productIds =
        form.productScope === 'all'
          ? []
          : productIdsText.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
      if (form.productScope !== 'all' && !form.productIds.length) return toast('请选择指定商品');
      if (form.id) {
        const i = store.coupons.findIndex((x) => x.id === form.id);
        store.coupons[i] = { ...form, productIds: [...form.productIds] };
      } else {
        store.coupons.push({ ...form, id: 'c' + Date.now(), productIds: [...form.productIds] });
      }
      show.value = false;
      toast('已保存');
    }
    function del(id) {
      if (!confirm('确认删除该优惠券？')) return;
      store.coupons = store.coupons.filter((c) => c.id !== id);
      toast('已删除');
    }
    return { store, show, form, productIdsText, typeLabel, openEdit, save, del };
  },
};

const CouponBatches = {
  template: `
  <div class="card">
    <div style="display:flex;justify-content:space-between">
      <h3 style="margin:0">批量发放列表</h3>
      <button class="btn ghost" @click="$router.push('/coupons')">返回优惠券</button>
    </div>
    <table style="margin-top:16px">
      <thead><tr><th>批次 ID</th><th>券名</th><th>人数</th><th>时间</th></tr></thead>
      <tbody>
        <tr v-for="b in store.batches" :key="b.id">
          <td>{{ b.id }}</td><td>{{ b.couponName }}</td><td>{{ b.userCount }}</td><td>{{ b.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  setup() {
    return { store };
  },
};

const Configs = {
  template: `
  <div class="card">
    <h3 style="margin-top:0">系统配置</h3>
    <table>
      <thead><tr><th>配置编码</th><th>配置说明</th><th>配置值</th><th>单位</th><th>操作</th></tr></thead>
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
        <div class="form-row"><label>配置值</label><input v-model="form.value" /></div>
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

const Admins = {
  template: `
  <div class="card">
    <h3 style="margin-top:0">管理员账号</h3>
    <table>
      <thead><tr><th>用户名</th><th>角色</th><th>启用</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="a in store.admins" :key="a.id">
          <td>{{ a.username }}</td>
          <td>{{ a.role }}</td>
          <td>
            <label><input type="checkbox" :checked="a.enabled" @change="toggle(a, $event)" /> {{ a.enabled?'启用':'停用' }}</label>
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
    return { store, toggle };
  },
};

const routes = [
  { path: '/', component: Dashboard },
  { path: '/users', component: Users },
  { path: '/users/:id', component: UserDetail, props: true },
  { path: '/orders', component: Orders },
  { path: '/orders/:id', component: OrderDetail, props: true },
  { path: '/products', component: Products },
  { path: '/coupons', component: Coupons },
  { path: '/coupon-batches', component: CouponBatches },
  { path: '/configs', component: Configs },
  { path: '/admins', component: Admins },
];

const router = createRouter({ history: createWebHashHistory(), routes });

const App = {
  template: `
  <div class="layout">
    <aside class="sider">
      <div class="brand">luckdate<span>管理后台 · 中文</span></div>
      <nav class="menu">
        <router-link to="/" exact-active-class="active">首页</router-link>
        <router-link to="/products">商品管理</router-link>
        <router-link to="/orders">订单管理</router-link>
        <router-link to="/coupons">优惠券管理</router-link>
        <router-link to="/configs">基础设置</router-link>
        <router-link to="/users">用户管理</router-link>
        <router-link to="/admins">管理员管理</router-link>
      </nav>
    </aside>
    <div class="main">
      <header class="topbar">
        <div>{{ title }}</div>
        <div style="color:#667;font-size:13px">演示账号 · 静态 Mock</div>
      </header>
      <main class="content"><router-view /></main>
    </div>
  </div>`,
  setup() {
    const titles = {
      '/': '数据概览',
      '/users': '用户列表',
      '/orders': '订单列表',
      '/products': '商品管理',
      '/coupons': '优惠券管理',
      '/coupon-batches': '批量发放列表',
      '/configs': '系统配置',
      '/admins': '管理员管理',
    };
    const title = computed(() => {
      const p = router.currentRoute.value.path;
      if (p.startsWith('/users/')) return '用户详情';
      if (p.startsWith('/orders/')) return '订单详情';
      return titles[p] || 'luckdate';
    });
    return { title };
  },
};

createApp(App).use(router).mount('#app');
