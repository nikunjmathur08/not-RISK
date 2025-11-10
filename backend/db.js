const { createClient } = require('@supabase/supabase-js')
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('./config')
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const db = {
  users: {
    async findOne(query) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .match(query)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async findById(id) {
      const { data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async create(userData) {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByIdAndUpdate(id, updateData) {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  accounts: {
    async create(accountData) {
      const { data, error } = await supabase
        .from('accounts')
        .insert(accountData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  appliances: {
    async create(applianceData) {
      const { data, error } = await supabase
        .from('appliances')
        .insert(applianceData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async find(query) {
      try {
        let queryBuilder = supabase
          .from('appliances')
          .select('*');
        
        if (query.userId) {
          queryBuilder = queryBuilder.eq('user_id', query.userId);
        }

        // Handle filter/search
        if (query.$or && query.$or.length > 0 && query.$or[0] && query.$or[0].name) {
          const filter = query.$or[0].name.$regex;
          if (filter) {
            queryBuilder = queryBuilder.ilike('name', `%${filter}%`);
          }
        }

        const { data, error } = await queryBuilder;
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error in appliances.find:', error);
        // Return empty array on error to prevent crashes
        return [];
      }
    },

    async findById(id) {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async findOne(query) {
      let queryBuilder = supabase
        .from('appliances')
        .select('*');

      if (query._id) {
        queryBuilder = queryBuilder.eq('id', query._id);
      }

      if (query.userId) {
        queryBuilder = queryBuilder.eq('user_id', query.userId);
      }

      const { data, error } = await queryBuilder.single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async findByIdAndUpdate(id, updateData) {
      const { data, error } = await supabase
        .from('appliances')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async findByIdAndDelete(id) {
      const { error } = await supabase
        .from('appliances')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  },

  receipts: {
    async create(receiptData) {
      const { data, error } = await supabase
        .from('receipts')
        .insert(receiptData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async findByApplianceId(applianceId) {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('appliance_id', applianceId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },

    async findById(id) {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }
}

module.exports = {db, supabase};