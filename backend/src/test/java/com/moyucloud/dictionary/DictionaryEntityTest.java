package com.moyucloud.dictionary;

import static org.junit.jupiter.api.Assertions.*;

import com.moyucloud.dictionary.domain.*;
import org.junit.jupiter.api.Test;

class DictionaryEntityTest {
    @Test
    void itemCanBeUpdatedAndToggled() {
        var i = new DictionaryItemEntity("A", "有效", 1);
        i.update("B", "停用", 2);
        i.setEnabled(false);
        assertEquals("B", i.getItemValue());
        assertEquals("停用", i.getItemLabel());
        assertFalse(i.isEnabled());
    }

    @Test
    void typeOwnsItems() {
        var t = new DictionaryTypeEntity("customer_status", "客户状态");
        t.addItem(new DictionaryItemEntity("A", "有效", 1));
        assertEquals(1, t.getItems().size());
    }
}
