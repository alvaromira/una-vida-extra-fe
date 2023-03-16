<script setup>
import { ref, computed } from "vue";
import RequestCard from "../../components/ui/request/RequestCard.vue";

const requests = ref([
  {
    id: 1,
    date: "01/01/2023",
    message: "Voluptas sed qui et aut consectetur esse facilis o.",
    distance: "34 km",
    isActive: true,
    productId: 13,
  },
  {
    id: 2,
    date: "02/02/2023",
    message: "Ut et vel quasi quia et assumenda.",
    distance: "450 m",
    isActive: false,
    productId: 8,
  },
]);

const numberOfRequests = computed(() => {
  return numberOfRequests < 1;
});
</script>

<template>
  <div>
    <h2>My requests</h2>
    <section>
      <div v-if="numberOfRequests">
        <p>You don't not have any active requests.</p>
      </div>

      <div v-else v-for="request in requests">
        <RequestCard
          :key="request.id"
          :id="request.id"
          :message="request.message"
          :distance="request.distance"
          :date="request.date"
          :isActive="request.isActive"
          :productId="request.productId"
        />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
