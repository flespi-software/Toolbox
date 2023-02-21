<template>
  <q-list separator class="q-py-none">
    <q-item v-if="entities.includes('platform')" to='/platform' active-class="bg-grey-6 text-white">
      <q-item-section avatar>
        <q-icon :name="config.platform.icon" color="red"/>
      </q-item-section>
      <q-item-section class="text-white">
        {{config.platform.label}}
      </q-item-section>
    </q-item>
    <q-expansion-item
      v-if="entities.includes('channels') || entities.includes('devices') || entities.includes('streams') || entities.includes('modems')"
      group="menu"
      label="Telematics Hub"
      icon="mdi-sitemap"
      :value="hubGroupModel"
      dark
    >
      <div>
        <q-list class="row q-py-none">
          <q-item v-if="entities.includes('channels')" to='/channels' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.channels.icon" size="2.6em"/>
              </div>
              <div>{{config.channels.label}}</div>
            </q-item-section>
          </q-item>
          <q-item v-if="entities.includes('devices')" to='/devices' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.devices.icon" size="2.6em"/>
              </div>
              <div>{{config.devices.label}}</div>
            </q-item-section>
          </q-item>
          <q-item v-if="entities.includes('groups')" to='/groups' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.groups.icon" size="2.6em"/>
              </div>
              <div>{{config.groups.label}}</div>
            </q-item-section>
          </q-item>
          <q-item v-if="entities.includes('streams')" to='/streams' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.streams.icon" size="2.6em"/>
              </div>
              <div>{{config.streams.label}}</div>
            </q-item-section>
          </q-item>
          <q-item v-if="entities.includes('modems')" to='/modems' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.modems.icon" size="2.6em"/>
              </div>
              <div>{{config.modems.label}}</div>
            </q-item-section>
          </q-item>
          <q-separator style="width: 100%" v-if="entities.includes('channels') || entities.includes('devices') || entities.includes('streams') || entities.includes('modems')"/>
          <!-- <q-item v-if="entities.includes('intervals')" to='/device/null/calc/null/intervals' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.intervals.icon" size="2.6em"/>
              </div>
              <div>{{config.intervals.label}}</div>
            </q-item-section>
          </q-item> -->
          <q-item v-if="entities.includes('calcs')" to='/calcs' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.calcs.icon" size="2.6em"/>
              </div>
              <div>{{config.calcs.label}}</div>
            </q-item-section>
          </q-item>
          <q-item v-if="entities.includes('plugins')" to='/plugins' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.plugins.icon" size="2.6em"/>
              </div>
              <div>{{config.plugins.label}}</div>
            </q-item-section>
          </q-item>
          <!-- <q-separator style="width: 100%" v-if="entities.includes('intervals') || entities.includes('calcs') || entities.includes('plugins')"/> -->
          <!-- <q-item-label header class="col-12 text-white" v-if="entities.includes('hexViewer') || entities.includes('trafficViewer') || entities.includes('deviceTraffic')">Tools</q-item-label>
          <q-item to='/tools/hex' class="col-6" v-if="entities.includes('hexViewer')" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.hexViewer.icon" size="2.6em"/>
              </div>
              <div>{{config.hexViewer.label}}</div>
            </q-item-section>
          </q-item>
          <q-item to='/tools/traffic' class="col-6" v-if="entities.includes('trafficViewer')" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.trafficViewer.icon" size="2.6em"/>
              </div>
              <div>{{config.trafficViewer.label}}</div>
            </q-item-section>
          </q-item>
          <q-item to='/tools/device-traffic' class="col-6" v-if="entities.includes('deviceTraffic')" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.deviceTraffic.icon" size="2.6em"/>
              </div>
              <div>{{config.deviceTraffic.label}}</div>
            </q-item-section>
          </q-item> -->
        </q-list>
      </div>
    </q-expansion-item>
    <q-expansion-item
      v-if="entities.includes('containers') || entities.includes('cdns')"
      group="menu"
      label="Storage"
      icon="mdi-database"
      :value="storageGroupModel"
      dark
    >
      <div>
        <q-list class="row q-py-none">
          <q-item v-if="entities.includes('containers')" to='/containers' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.containers.icon" size="2.6em"/>
              </div>
              <div>{{config.containers.label}}</div>
            </q-item-section>
          </q-item>
          <q-item v-if="entities.includes('cdns')" to='/cdns' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.cdns.icon" size="2.6em"/>
              </div>
              <div>{{config.cdns.label}}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-expansion-item>
    <q-expansion-item
      group="menu"
      label="MQTT"
      icon="mdi-access-point-network"
      :value="mqttGroupModel" dark
      v-if="entities.includes('mqtt') || entities.includes('mqttClient')"
    >
      <div>
        <q-list class="row q-py-none">
          <q-item v-if="entities.includes('mqtt')" to='/mqtt' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.mqtt.icon" size="2.6em"/>
              </div>
              <div>{{config.mqtt.label}}</div>
            </q-item-section>
          </q-item>
          <q-separator v-if="entities.includes('mqtt')" style="width: 100%"/>
          <q-item-label header class="col-12 text-white">Tools</q-item-label>
          <q-item to='/tools/mqtt' class="col-6" active-class="bg-grey-6">
            <q-item-section class="text-center text-white">
              <div>
                <q-icon :name="config.mqttClient.icon" size="2.6em"/>
              </div>
              <div>{{config.mqttClient.label}}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script>
export default {
  props: ['config', 'entities', 'entity'],
  computed: {
    hubGroupModel () {
      const entity = this.entity
      return entity === 'channels' || entity === 'calcs' || entity === 'intervals' || entity === 'plugins' || entity === 'devices' || entity === 'streams' || entity === 'modems' || entity === 'hexViewer' || entity === 'trafficViewer' || entity === 'intervals'
    },
    storageGroupModel () {
      const entity = this.entity
      return entity === 'containers' || entity === 'cdns'
    },
    mqttGroupModel () {
      const entity = this.entity
      return entity === 'mqtt' || entity === 'mqttClient'
    }
  }
}
</script>
