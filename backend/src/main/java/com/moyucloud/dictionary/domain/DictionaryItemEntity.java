package com.moyucloud.dictionary.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;

@Entity
@Table(name = "sys_dict_item")
public class DictionaryItemEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private DictionaryTypeEntity type;

    @Column(nullable = false, length = 80)
    private String itemValue;

    @Column(nullable = false, length = 120)
    private String itemLabel;

    private boolean enabled = true;
    private int sortOrder;

    protected DictionaryItemEntity() {}

    public DictionaryItemEntity(String v, String l, int s) {
        itemValue = v;
        itemLabel = l;
        sortOrder = s;
    }

    @PrePersist
    void assign() {
        if (id == null) id = Ulid.next();
    }

    void setType(DictionaryTypeEntity t) {
        type = t;
    }

    public DictionaryTypeEntity getType() {
        return type;
    }

    public String getId() {
        return id;
    }

    public String getItemValue() {
        return itemValue;
    }

    public String getItemLabel() {
        return itemLabel;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void update(String v, String l, int s) {
        itemValue = v;
        itemLabel = l;
        sortOrder = s;
    }

    public void setEnabled(boolean e) {
        enabled = e;
    }
}
