package com.moyucloud.dictionary.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "sys_dict_type")
public class DictionaryTypeEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @Column(nullable = false, unique = true, length = 80)
    private String dictCode;

    @Column(nullable = false, length = 120)
    private String dictName;

    @Column(nullable = false)
    private boolean enabled = true;

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DictionaryItemEntity> items = new ArrayList<>();

    protected DictionaryTypeEntity() {}

    public DictionaryTypeEntity(String code, String name) {
        dictCode = code;
        dictName = name;
    }

    @PrePersist
    void assign() {
        if (id == null) id = Ulid.next();
    }

    public String getId() {
        return id;
    }

    public String getDictCode() {
        return dictCode;
    }

    public String getDictName() {
        return dictName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public List<DictionaryItemEntity> getItems() {
        return items;
    }

    public void addItem(DictionaryItemEntity i) {
        items.add(i);
        i.setType(this);
    }

    public void update(String name) {
        dictName = name;
    }

    public void setEnabled(boolean e) {
        enabled = e;
    }
}
