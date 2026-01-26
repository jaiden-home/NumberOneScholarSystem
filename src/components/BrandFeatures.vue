<template>
  <div class="brand-features">
    <div class="brand">
      <h1>DES备考系统</h1>
      <p class="subtitle">
        专业的DES考试备考平台，提供全面的学习资源和模拟测试，助您获取全科5**状元
      </p>
    </div>

    <div class="features">
      <div class="feature-item">
        <div class="icon">📚</div>
        <div class="text">
          <h3>丰富学习资源</h3>
          <p>全面覆盖考试知识点，提供高质量学习材料</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="icon">🖥️</div>
        <div class="text">
          <h3>模拟测试系统</h3>
          <p>真实还原考试环境，帮助您熟悉考试流程</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="icon">📈</div>
        <div class="text">
          <h3>学习数据分析</h3>
          <p>智能分析学习情况，提供个性化学习建议</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.brand-features {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand h1 {
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: bold;
}

.brand .subtitle {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 40px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature-item .icon {
  background: rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-item .text h3 {
  font-size: 16px;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.feature-item .text p {
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .brand-features {
    padding: 2rem;
    text-align: center;
  }

  .brand h1 {
    font-size: 2rem;
  }

  .feature-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .feature-item .icon {
    margin-top: 0;
  }
}
</style>
